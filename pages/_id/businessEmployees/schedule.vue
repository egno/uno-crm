<template>
  <div class="employees-schedule">
    <div>
      <main-button
        class="button_attractive"
      >
        <span>Сохранить изменения</span>
      </main-button>
    </div>
    <table>
      <thead>
        <tr>
          <td class="employees-schedule__employees">
            <v-layout align-center justify-space-around>
              <EmployeesSelection
                :visible-employees="visibleEmployees"
                :show-category-checkbox="true"
                @addVisibleEmployee="addVisibleEmployee"
                @removeVisibleEmployee="removeVisibleEmployee"
              />
              <div>Все мастера</div>
            </v-layout>
          </td>
          <td class="employees-schedule__template-column">
            Активные шаблоны
          </td>
          <td v-for="(day, dayIndex) in selectedWeek" :key="dayIndex" class="employees-schedule__cell">
            <div class="employees-schedule__date">
              {{ day.display }}
            </div>
            <div class="employees-schedule__dow">
              {{ day.date.toLocaleString('ru-RU', { weekday: 'short' }) }}
            </div>
          </td>
          <td colspan="2" class="employees-schedule__summary">
            Итого
          </td>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(employee, employeeIndex) in visibleEmployees"
          :key="employeeIndex"
          class="schedule-row"
        >
          <td class="schedule-row__employee">
            <EmployeeSimpleCard :employee="employee" />
          </td>
          <td class="schedule-row__data-cell schedule-row__template">
            <template v-if="employee.j.workTemplate && employee.j.workTemplate.title">
              <div> {{ getEmployeeTemplate(employee).title }} </div>
              <div>
                <button type="button" class="schedule-row__add-template" @click="openAssignForm(employee)">
                  Изменить
                </button>
              </div>
            </template>
            <div v-else>
              <span class="employees-schedule__warning">У сотрудника нет активного шаблона.</span>
              <button type="button" class="schedule-row__add-template" @click="openAssignForm(employee)">
                Назначить
              </button>
            </div>
          </td>
          <td v-for="(day , di) in getEmpWeekSchedule(employee)" :key="di" :class="[ 'schedule-row__data-cell', { 'day-off': !day[0] } ]" @dblclick="enabled = di">
            <div :class="{ white: day[0] }">
              <input type="text" :value="day[0]" :disabled="enabled !== di" @focus="onFocus" @blur="onBlur" @change="changeDateSchedule(di, $event.target.value, true)">
              <input type="text" :value="day[1]" :disabled="enabled !== di" @focus="onFocus" @blur="onBlur" @change="changeDateSchedule(di, $event.target.value, false)">
            </div>
          </td>
          <td class="schedule-row__data-cell">
            <div>
              {{ hoursCount(employee).hours }}ч {{ hoursCount(employee).minutes }}м
            </div>
          </td>
          <td class="schedule-row__data-cell last">
            <div>{{ workShiftsCount(employee) }}</div>
          </td>
        </tr>
      </tbody>
    </table>
    <div>
      <button v-if="commonTemplates.length" type="button" @click="showTemplatesListEdit">
        Редактировать список шаблонов
      </button>
    </div>

    <v-dialog
      :value="templateAssignForm"
      :content-class="`right-attached-panel businesscard-form _templates ${isCreating ? 'creating' : ''}`"
      transition="slide"
      @input="closeAssignForm"
    >
      <v-layout class="right-attached-panel__container">
        <button
          type="button"
          class="right-attached-panel__close"
          @click="closeAssignForm"
        />
        <div class="right-attached-panel__content">
          <div class="right-attached-panel__header">
            Шаблоны графика работы
          </div>
          <Chip
            id="create_template"
            v-model="isCreating"
            :checked="isCreating"
            label="Создать новый шаблон"
            name="create_template"
          />

          <template v-if="isCreating">
            <div class="right-attached-panel__field-block">
              <VTextField
                v-model="templateTitle"
                label="НАЗВАНИЕ ШАБЛОНА"
                :rules="[
                  rules.required,
                  (value) =>
                    (!!value && value.length <= 20) ||
                    'Слишком длинное название'
                ]"
                maxlength="50"
                class="businesscard-form__field"
              />
            </div>
            <div class="right-attached-panel__field-block dropdown-select">
              <VSelect
                v-model="templateType"
                :items="templateTypes"
                :item-text="(temp) => temp.name"
                label="ВИД"
                attach=".right-attached-panel__field-block.dropdown-select"
                :rules="[ rules.required ]"
              />
            </div>
            <div class="right-attached-panel__field-block">
              <div v-show="templateType" class="employees-schedule__warning">
                Заполните рабочее время сотрудника,
                или оставьте поля пустыми, если день
                является выходным
              </div>
              <template v-if="templateType === 'week'">
                <div class="employees-schedule__week-template is-creating">
                  <v-layout justify-space-between class="employees-schedule__heading">
                    <span>День недели</span><span>Расписание</span>
                  </v-layout>
                  <BusinessScheduleEdit
                    :show-header="false"
                    :show-tumbler="false"
                    :week-schedule="selectedEmployeeSchedule"
                    @editWeek="scheduleEdit"
                  />
                </div>
              </template>
              <template v-else-if="templateType === 'shift'">
                <div class="employees-schedule__shift-template is-creating">
                  <v-layout justify-space-between class="employees-schedule__heading">
                    <span>День смены</span><span>Расписание</span>
                  </v-layout>
                  <div>
                    <div v-for="(day, index) in shiftDays" :key="index" xs12 class="business-schedule">
                      <div class="business-schedule__wrapper">
                        <div class="business-schedule__dayname">
                          {{ index + 1 }}й
                        </div>
                        <div class="business-schedule__content">
                          <DaySchedule
                            :business-schedule="day"
                            @editDay="onEditDay(index, $event)"
                          />
                          <button type="button" @click="deleteShiftDay(index)">
                            убрать
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <button type="button" class="employees-schedule__add-shift" @click="addShiftDay">
                      Добавить день смены
                    </button>
                  </div>
                  <v-menu>
                    <template v-slot:activator="{ on }">
                      <button type="button" v-on="on">
                        Дата начала {{ selectedDayFormatted }}
                      </button>
                    </template>
                    <v-date-picker
                      v-model="templateStartDate"
                      :allowed-dates="allowedDates"
                      locale="ru-RU"
                      no-title
                      first-day-of-week="1"
                    />
                  </v-menu>
                </div>
              </template>
            </div>
            <div class="right-attached-panel__buttons">
              <button
                type="button"
                class="right-attached-panel__save"
                :class="{ _disabled: shiftScheduleHasErrors }"
                @click="saveTemplate"
              >
                Сохранить
              </button>
              <button
                type="button"
                class="right-attached-panel__cancel"
                @click="onClose"
              >
                Отмена
              </button>
            </div>
          </template>

          <template v-else-if="selectedEmployee && !isCreating">
            <Accordion
              v-if="selectedEmployee.j.workTemplate && selectedEmployee.j.workTemplate.title"
              :expanded="true"
              class="current-template"
            >
              <template slot="heading">
                <div>Активный шаблон сотрудника</div>
              </template>
              <template slot="content">
                <div>{{ selectedEmployee.j.workTemplate.title }}</div>
                <DeleteButton
                  :is-dark="true"
                  delete-text="Удалить шаблон"
                  @click.native.stop="deleteEmpTemplate"
                />
                <div v-if="selectedEmployee.j.workTemplate.type === 'shift'">
                  Дата начала шаблона
                </div>
              </template>
            </Accordion>
            <Accordion v-if="commonTemplates.length" :expanded="true" class="available-templates">
              <template slot="heading">
                <div>Список доступных шаблонов</div>
              </template>
              <template slot="content">
                <div
                  v-for="(template, i) in commonTemplates"
                  :key="i"
                >
                  <!-- todo replace with radiobuttons -->
                  <SmallCheckbox
                    :id="template.title"
                    :checked="isAssigned(template)"
                    name="template.title"
                    :value="template.title"
                    @change="assignTemplate(template, $event)"
                  >
                    {{ template.title }}
                  </SmallCheckbox>
                </div>
              </template>
            </Accordion>
            <div class="right-attached-panel__buttons">
              <button
                type="button"
                class="right-attached-panel__save"
                @click="saveEmployee"
              >
                Сохранить
              </button>
              <button
                type="button"
                class="right-attached-panel__cancel"
                @click="closeAssignForm"
              >
                Отмена
              </button>
            </div>
          </template>
        </div>
      </v-layout>
    </v-dialog>

    <v-dialog
      :value="templatesListEdit"
      content-class="right-attached-panel businesscard-form _templates"
      transition="slide"
      @input="templatesListEdit = false"
    >
      <v-layout class="right-attached-panel__container">
        <button
          type="button"
          class="right-attached-panel__close"
          @click="templatesListEdit = false"
        />
        <div class="right-attached-panel__content">
          <div class="right-attached-panel__header">
            Редактирование списка шаблонов
          </div>

          <div v-if="newBusiness && newBusiness.j" class="templates-list">
            <div
              v-for="(template, i) in newBusiness.j.scheduleTemplates"
              :key="i"
            >
              <div>{{ template.title }}</div>
              <DeleteButton
                :is-dark="true"
                delete-text="Удалить шаблон"
                @click.native.stop="deleteCommonTemplate"
              />
            </div>
          </div>

          <div class="right-attached-panel__buttons">
            <button
              type="button"
              class="right-attached-panel__save"
              @click="saveTemplatesList"
            >
              Сохранить
            </button>
            <button
              type="button"
              class="right-attached-panel__cancel"
              @click="closeTemplatesList"
            >
              Отмена
            </button>
          </div>
        </div>
      </v-layout>
    </v-dialog>
  </div>
</template>

<script>
/* eslint-disable vue/no-unused-components */
import { mapActions, mapGetters, mapState } from 'vuex'
import { cloneDeep } from 'lodash'
import SmallCheckbox from '~/components/common/SmallCheckbox'
import { employeesCategorized } from '~/mixins/employee'
// import Modal from '~/components/common/Modal'
import Accordion from '~/components/common/Accordion'
import BusinessScheduleEdit from '~/components/business/BusinessScheduleEdit.vue'
import Chip from '~/components/common/Chip.vue'
import DaySchedule from '~/components/business/DaySchedule.vue'
import DeleteButton from '~/components/common/DeleteButton.vue'
import EmployeesSelection from '~/components/employee/EmployeesSelection.vue'
import EmployeeSimpleCard from '~/components/employee/EmployeeSimpleCard.vue'
import MainButton from '~/components/common/MainButton.vue'
import Business from '~/classes/business'
import Employee from '~/classes/employee'
import { hyphensStringToDate } from '~/components/calendar/utils'

export default {
  // eslint-disable-next-line standard/object-curly-even-spacing
  components: { Accordion, BusinessScheduleEdit, Chip, DaySchedule, DeleteButton, EmployeesSelection, EmployeeSimpleCard, MainButton, SmallCheckbox },
  mixins: [ employeesCategorized ],
  data () {
    return {
      isStillEditing: false,
      enabled: null,
      isCreating: false,
      isCommonTemplate: false,
      newBusiness: {},
      selectedDate: '',
      selectedEmployee: null,
      selectedOnStart: false,
      shiftDays: [ {
        start: '',
        end: '',
      } ],
      shiftScheduleHasErrors: false,
      templateAssignForm: false,
      templatesListEdit: false,
      templateStartDate: '',
      templateTitle: '',
      templateType: '',
      templateTypes: [
        {
          value: 'week',
          name: 'Недельный',
        },
        {
          value: 'shift',
          name: 'Сменный',
        },
      ],
      weekTemplate: [],
      visibleEmployees: [],
      rules: {
        required: value => !!value || 'Обязательно для заполнения',
      },
    }
  },
  computed: {
    ...mapGetters({
      actualDate: 'common/actualDate',
      calendarMonth: 'common/calendarMonth',
    }),
    ...mapState({
      businessInfo: state => state.business.businessInfo,
    }),
    commonTemplates () {
      if (!this.businessInfo.scheduleTemplates) {
        return []
      }
      return this.businessInfo.scheduleTemplates.filter(t => t.common) || []
    },
    selectedEmployeeSchedule () {
      if (!this.selectedEmployee) {
        return
      }
      return this.selectedEmployee.j.workTemplate
    },
    selectedWeek () {
      if (!this.selectedDate) { return [] }

      const includesDay = day => day.dateKey === this.selectedDate

      return this.calendarMonth.find(week => week.some(includesDay))
    },
    selectedDayFormatted () {
      if (!this.selectedDate) { return '' }
      const options = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      }
      return hyphensStringToDate(this.selectedDate).toLocaleString(
        'ru',
        options
      )
    },
  },
  watch: {
    businessEmployees: {
      handler (newVal) {
        if (this.selectedOnStart) {
          return
        }
        if (newVal && newVal.length) {
          this.initVisibleEmployees()
          this.selectedOnStart = true
        }
      },
      deep: true,
    },
  },
  beforeMount () {
    this.selectedDate = this.actualDate
    this.templateStartDate = this.actualDate
  },
  methods: {
    ...mapActions({
      saveBusiness: 'business/saveBusiness',
      addEmployeeItem: 'employee/addEmployeeItem',
    }),
    addShiftDay () {
      this.shiftDays.push({
        start: '',
        end: '',
      })
    },
    addVisibleEmployee (e) {
      this.visibleEmployees.push(e)
      this.visibleEmployees.sort(this.compareByName)
    },
    allowedDates (dateStr) {
      return dateStr >= this.selectedDate
    },
    assignTemplate (template, isChecked) {
      this.selectedEmployee.j.workTemplate = template && isChecked
        ? template
        : null
    },
    closeAssignForm () {
      this.templateAssignForm = false
      this.isCreating = false
      this.templateStartDate = this.actualDate
      this.templateTitle = ''
      this.templateType = ''
      this.shiftDays = [ {
        start: '',
        end: '',
      } ]
    },
    closeTemplatesList () {
      this.newBusiness = {}
      this.templatesListEdit = false
    },
    datesDiff (first, second) {
      return Math.floor((second - first) / (1000 * 60 * 60 * 24))
    },
    deleteCommonTemplate (temp) {
      const templates = this.newBusiness.scheduleTemplates
      const index = templates.findIndex(t => t.title === temp.title)

      templates.splice(index, 1)
    },
    deleteEmpTemplate () {
      this.assignTemplate(null, false)
    },
    deleteShiftDay (index) {
      this.shiftDays.splice(index, 1)
    },
    getEmpWeekSchedule (employee) {
      const empty = [ [], [], [], [], [], [], [] ]

      // todo merge with irregular days
      if (employee.j.workTemplate && employee.j.workTemplate.type) {
        const template = this.getEmployeeTemplate(employee)
        if (template.type === 'week') {
          return template.data
        }

        const period = template.data.length
        const startDate = template.startDate

        if (!startDate) {
          return empty
        }
        const diff = this.datesDiff(startDate, this.selectedWeek[0].date) // или предыдущий день?
        let currentDay = diff % period
        // eslint-disable-next-line prefer-const
        let week = []
        // todo add previous week's sunday as a start point
        for (let i = 0; i < 7; i++) {
          week[i] = template.data[currentDay]
          currentDay = currentDay < (period - 1) ? (currentDay + 1) : 0
        }

        return week
      } else {
        return empty
      }
    },
    getEmployeeTemplate (employee) {
      if (!employee.j.workTemplate || !employee.j.workTemplate.title) {
        return
      }

      return this.businessInfo.scheduleTemplates.find(t => t.title === employee.j.workTemplate.title)
    },
    initVisibleEmployees () {
      this.businessEmployees.forEach((employee) => {
        if (!this.visibleEmployees.some(emp => emp.id === employee.id)) {
          this.visibleEmployees.push(employee)
          if (!this.selectedCategories.includes(employee.j.category)) {
            this.selectedCategories.push(employee.j.category)
          }
        }
      })
      this.visibleEmployees.sort(this.compareByName)
    },
    isAssigned (template) {
      return this.selectedEmployee.j.workTemplate && this.selectedEmployee.j.workTemplate.title === template.title
    },
    openAssignForm (employee) {
      this.selectedEmployee = new Employee(cloneDeep(employee))
      if (!this.selectedEmployee.j.schedule.data) {
        this.selectedEmployee.j.schedule.data = []
      }

      this.templateAssignForm = true
    },
    onClearDay (index) {
      this.shiftDays[index] = { start: '', end: '' }
    },
    onClose () {},
    onEditDay (dayIndex, { newDaySchedule, errors }) {
      if (!this.shiftDays || !this.shiftDays.length) {
        return
      }
      this.shiftDays[dayIndex] = newDaySchedule
      this.shiftScheduleHasErrors = !!errors.length
    },
    saveTemplate () {
      const newTemplate = {
        title: this.templateTitle,
        type: this.templateType,
        data: this.templateType === 'shift' ? this.shiftDays : this.weekTemplate,
      }

      // check if the template was created or edited
      newTemplate.common = this.isCreating ? true : this.isCommonTemplate

      const newValues = new Business(cloneDeep(this.businessInfo))

      if (newValues.scheduleTemplates) {
        newValues.scheduleTemplates.push(newTemplate)
      } else {
        newValues.scheduleTemplates = [ newTemplate ]
      }
      this.saveBusiness(newValues)
        .then(() => {
          this.isCreating = false
          this.assignTemplate(newTemplate, true)
        })
    },
    saveEmployee () {
      if (this.selectedEmployee.j.workTemplate) {
        // at this moment workTemplate is already in store in business' templates
        // We should not save workTemplate.data in employee, but keep it in business,
        // so that after any change in a common template, it doesn't need to change
        // the corresponding data in employee
        this.selectedEmployee.j.workTemplate = cloneDeep(this.selectedEmployee.j.workTemplate)
        this.selectedEmployee.j.workTemplate.data = null
      }

      this.selectedEmployee.save()
        .then((res) => {
          this.addEmployeeItem(res)
          this.templateAssignForm = false
          this.updateVisibleEmployees()
        })
    },
    saveTemplatesList () {
      this.saveBusiness(this.newBusiness)
        .then(() => {
          this.templatesListEdit = false
        })
    },
    scheduleEdit (newWeek) {
      this.weekTemplate = newWeek.data
    },
    showTemplatesListEdit () {
      this.newBusiness = new Business(cloneDeep(this.businessInfo))
      this.templatesListEdit = true
    },
    changeDateSchedule (i, data, isStart) {
      this.$emit('changeDateSchedule', {
        i,
        data,
        isStart,
      })
    },
    getTimeDiff (start = '00:00', end = '00:00') {
      const startTime = `${start}:00`
      const endTime = `${end}:00`
      const startDate = new Date(`January 1, 1970 ${startTime}`)
      const endDate = new Date(`January 1, 1970 ${endTime}`)
      return endDate - startDate
    },
    onFocus () {
      this.isStillEditing = true
    },
    onBlur () {
      this.isStillEditing = false
      setTimeout(() => {
        if (this.isStillEditing) {
          return
        }
        this.enabled = null
        this.isStillEditing = false
      }, 50)
    },
    hoursCount (employee) {
      let total = 0
      this.getEmpWeekSchedule(employee).forEach((d) => {
        total += this.getTimeDiff(d[0], d[1])
      })
      const toHours = 1000 * 60 * 60
      const hours = Math.floor(total / toHours)
      const modulo = total % toHours
      return {
        hours,
        minutes: Math.floor(modulo / 1000 / 60),
      }
    },
    updateVisibleEmployees () {
      const newVisibleEmployees = []

      this.visibleEmployees.forEach((visEmp) => {
        newVisibleEmployees.push(this.businessEmployees.find(busEmp => busEmp.id === visEmp.id))
      })

      this.visibleEmployees = newVisibleEmployees
    },
    workShiftsCount (employee) {
      return this.getEmpWeekSchedule(employee).filter(d => d[0] && d[1]).length
    },
  },
}
</script>

<style lang="scss">
  @import '~assets/styles/common.scss';
  @import '~assets/styles/right-attached-panel.scss';
  @import '~assets/styles/dropdown-select.scss';

  @mixin border-left {
    border-left: 1px solid  #d6dae3;
  }
  .employees-schedule {
    background-color: #fff;
    table {
      max-width: 1084px;
      border-collapse: collapse;
      text-align: center;
    }
    tr {
      border-bottom: 1px solid #d6dae3;
    }
    &__employees {
      width: 190px;
    }
    &__template-column {
      width: 150px;
      line-height: 24px;
      @include border-left();
      border-right: 1px solid  #d6dae3;
    }
    &__cell {
      width: 72px;
      height: 80px;
    }
    &__date {
      font-family: Roboto Slab, serif;
    }
    &__dow {
      margin-top: 16px;
      text-transform: capitalize;
    }
    &__summary {
      width: 144px;
      @include border-left();
      border-right: 1px solid  #d6dae3;
    }
    /*&__accordion {
      min-width: 284px;
      .accordion__header {
        display: flex;
        justify-content: space-between;
        padding-right: 70px;
      }
      .business-schedule__main {
        padding: 0;
      }
      input {
        padding-bottom: 0;
        background: transparent;
      }
    }*/
    &__warning {
      font-size: 12px;
      color: #8995AF;
    }
    &__heading {
      margin-top: 30px;
      font-weight: 600;
    }
    &__add-shift {
      margin: 18px 0;
      font-size: 14px;
      color: #8995AF;
    }
  }
  .schedule-row {
    color: #07101C;
    &__data-cell {
      min-width: 72px;
      @include border-left();
      input {
        width: 100%;
        text-align: center;
      }
      &.day-off {
        background-color: rgba(137, 149, 175, 0.1);
        pointer-events: none;
      }
      &.last {
        border-right: 1px solid #d6dae3;
      }
    }
    &__template {
      padding-top: 8px;
    }
    &__add-template {
      margin-top: 5px;
      font-size: 14px;
      color: #5699FF;
      outline: none;
    }
  }
  ._templates {
    .accordion.current-template .accordion__header:after,
    .accordion.available-templates .accordion__header:after {
      display: none;
    }
    .checkbox {
      margin-top: 30px;
    }
    .checkbox__label {
      margin-bottom: 0;
    }
    .employees-schedule__heading {
      max-width: 195px;
    }
    button {
      outline: none;
    }
  }
</style>
