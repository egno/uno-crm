<template>
  <div class="employees-schedule">
    <table>
      <thead>
        <tr>
          <td colspan="2">
            <v-layout>
              <main-button
                class="fill-table"
                @click="fillTableDebounced"
              >
                <span>Заполнить график по шаблонам</span>
              </main-button>
              <button v-if="businessTemplates.length" type="button" class="templates-list-edit" @click="showTemplatesListEditDebounced" />
            </v-layout>
          </td>
          <td colspan="4">
            <v-layout>
              <div class="change-week">
                <v-btn
                  class="change-week__button"
                  depressed
                  flat
                  small
                  @click.stop="changeWeek(-1)"
                />
                <v-btn
                  class="change-week__button right"
                  depressed
                  flat
                  small
                  @click.stop="changeWeek(1)"
                />
              </div>
              <div v-if="selectedWeek && selectedWeek.length" class="week-days">
                {{ selectedWeek[0].date.toLocaleString('ru-RU', { day: 'numeric', month: '2-digit'}) }}
                &#8212;
                {{ selectedWeek[6].date.toLocaleString('ru-RU', { day: 'numeric', month: '2-digit'}) }}
              </div>
            </v-layout>
          </td>
          <td colspan="3">
            <button type="button" class="employees-schedule__reset" @click="showReset = true">
              Загрузить сохранение
            </button>
          </td>
          <td colspan="2" class="employees-schedule__summary">
            <button type="button" class="employees-schedule__empty" @click="showModal = true">
              Очистить
            </button>
          </td>
        </tr>
        <tr>
          <td class="employees-schedule__employees">
            <v-layout align-center justify-space-around>
              <EmployeesSelection
                :visible-employees="visibleEmployees"
                :show-category-checkbox="true"
                @addVisibleEmployee="addVisibleEmployee"
                @removeVisibleEmployee="removeVisibleEmployee"
              />
              <div class="table-header">
                Мастера
              </div>
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
          <td colspan="2" class="employees-schedule__summary table-header">
            Итого
          </td>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(employee, employeeIndex) in visibleEmployees"
          :key="employeeIndex"
          class="schedule-row"
          :class="{ 'has-errors': dayScheduleErrors.length }"
        >
          <td class="schedule-row__employee">
            <EmployeeSimpleCard :employee="employee" />
          </td>
          <td class="schedule-row__data-cell schedule-row__template">
            <template v-if="employee.j.workTemplate && getEmployeeTemplate(employee)">
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
          <td
            v-for="(day , di) in workingDays[employee.id]"
            :key="day.date + day.employeeId"
            :class="[ 'schedule-row__data-cell',
                      { 'editing': enabled === day.date + day.employeeId,
                        'day-off': !day || !day.start,
                        'past': day.date < actualDate,
                      },
            ]"
            @click="onClick(day.date, day.employeeId, $event.target)"
          >
            <div :class="{ white: day && (day.start || day.end) }">
              <TimeEdit
                :ref="day.date + day.employeeId"
                :time="day && day.start"
                :disabled="enabled !== day.date + day.employeeId"
                :class="{ 'error--text' : lastEdited === day.date + day.employeeId && (dayScheduleErrors.includes('intervalError') || (day.end && !day.start)) }"
                placeholder="--:--"
                @focus="onFocus"
                @blur="onBlur"
                @correctInput="changeDateSchedule(employee.id, di, $event, true)"
              />
              <TimeEdit
                :time="day && day.end"
                :disabled="enabled !== day.date + day.employeeId"
                :class="{ 'error--text' : lastEdited === day.date + day.employeeId && (dayScheduleErrors.includes('intervalError') || (day.start && !day.end)) }"
                placeholder="--:--"
                @focus="onFocus"
                @blur="onBlur"
                @correctInput="changeDateSchedule(employee.id, di, $event, false)"
              />
            </div>
          </td>
          <td class="schedule-row__data-cell">
            <div class="important-text">
              {{ hoursCount(employee).hours }}ч {{ hoursCount(employee).minutes }}м
            </div>
          </td>
          <td class="schedule-row__data-cell last">
            <div class="important-text">
              {{ empWorkDaysCount(employee) }}
            </div>
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colspan="2" class="employees-schedule__footer table-header">
            Всего сотрудников в смену
          </td>
          <td v-for="(day, dayIndex) in selectedWeek" :key="dayIndex" class="schedule-row__data-cell">
            {{ loadPerDay(day.dateKey) }}
          </td>
          <td colspan="2" class="schedule-row__data-cell" />
        </tr>
      </tfoot>
    </table>

    <div class="bottom-placeholder" />
    <v-expand-transition>
      <v-bottom-nav
        v-show="isChanged() && !dayScheduleErrors.length"
        :value="isChanged() && !dayScheduleErrors.length"
        height="80"
        absolute
        color="transparent"
      >
        <span>Вы внесли изменения в график работы.</span>
        <main-button
          class="button save-table"
          :class="{ button_disabled: !isChanged() || dayScheduleErrors.length }"
          @click="saveTableDebounced"
        >
          <span>СОХРАНИТЬ</span>
        </main-button>
      </v-bottom-nav>
    </v-expand-transition>
    <!-- todo replace all Modals with one with slots -->
    <Modal
      :visible="showModal"
      @close="showModal = false"
    >
      <template slot="header">
        Очистить график сотрудников?
      </template>
      <template slot="text">
        <div>
          Все данные за выделенный период
          с&nbsp;{{ selectedWeek[0].date.toLocaleString('ru-RU', { day: 'numeric', month: '2-digit'}) }}
          по {{ selectedWeek[6].date.toLocaleString('ru-RU', { day: 'numeric', month: '2-digit'}) }} будут&nbsp;удалены.
        </div>
      </template>
      <template slot="buttons">
        <button
          type="button"
          class="uno-modal__left"
          @click="showModal = false"
        >
          Отмена
        </button>
        <button
          type="button"
          class="uno-modal__right"
          @click="fillWithEmpty(); showModal = false"
        >
          ПРИНЯТЬ
        </button>
      </template>
    </Modal>
    <Modal
      :visible="showChangeWeekModal"
      :template="saveTableTemplate"
      @rightButtonClick="saveAndGo"
      @leftButtonClick="resetChanges(); changeWeek(changeWeekDirection)"
      @close="showChangeWeekModal = false"
    >
      <template slot="text">
        <div>
          Вы внесли изменения в график работы. Сохранить?
        </div>
      </template>
    </Modal>
    <Modal
      :visible="showReset"
      :template="resetModalTemplate"
      @rightButtonClick="resetChanges"
      @leftButtonClick="showReset = false"
      @close="showReset = false"
    >
      <template slot="text">
        <div>
          <div>Вернуться к последнему сохраненному графику работы?</div>
          <br>
          <div>Измененные данные при этом будут&nbsp;утеряны.</div>
        </div>
      </template>
    </Modal>
    <Modal
      :visible="showDelete"
      :template="deleteModalTemplate"
      @rightButtonClick="deleteBusinessTemplate(deletingTemplate)"
      @leftButtonClick="showDelete = false; deletingTemplate = null"
      @close="showDelete = false; deletingTemplate = null"
    >
      <template slot="text">
        <div v-if="deletingTemplate">
          Данный шаблон назначен {{ businessEmployees.filter(e => e.j.workTemplate && e.j.workTemplate.title === deletingTemplate.title).length }} сотрудникам. Хотите удалить?
        </div>
      </template>
    </Modal>
    <v-dialog
      :value="templateAssignForm"
      :content-class="`right-attached-panel businesscard-form templates ${isCreating ? 'creating' : ''}`"
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
            {{ !isCreating && !isEditing || isCreating? 'Назначение шаблона сотруднику' : 'Редактирование шаблона' }}
          </div>
          <Chip
            v-if="!isCreating && !isEditing || isCreating"
            id="create_template"
            v-model="isCreating"
            label="Создать новый шаблон"
            name="create_template"
          />
          <template v-if="isCreating || isEditing">
            <TemplateEdit
              :template="isCreating? {} : selectedEmployeeTemplate"
              :show-start-date="false"
              @cancel="closeAssignForm"
              @saved="onEmployeeTemplateSaved"
            />
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
                <TemplateCard
                  :editable="false"
                  :selectable="true"
                  :checked="isAssigned(selectedEmployeeTemplate)"
                  :template="selectedEmployeeTemplate"
                  @change="onSelectTemplate(selectedEmployeeTemplate, $event)"
                  @edit="openEditForm"
                  @delete="deleteEmpTemplate"
                >
                  <div class="current-template__start">
                    <div class="current-template__start-date">
                      <v-text-field
                        :value="getMaskedDate(templateStartDate)"
                        mask="##.##.####"
                        label="ДАТА НАЧАЛА"
                        placeholder="ДД.ММ.ГГГГ"
                        :rules="[validateDate]"
                        validate-on-blur
                        return-masked-value
                        @input="onInputDate"
                      />
                    </div>
                  </div>
                </TemplateCard>
              </template>
            </Accordion>
            <Accordion v-if="businessTemplates.length" :expanded="true" class="templates__available">
              <template slot="heading">
                <div>Список шаблонов</div>
              </template>
              <template slot="content">
                <TemplateCard
                  v-for="(template, i) in businessTemplates"
                  :key="i"
                  :checked="isAssigned(template)"
                  :editable="false"
                  :selectable="true"
                  :template="template"
                  @change="onSelectTemplate(template, $event)"
                />
              </template>
            </Accordion>
            <div class="right-attached-panel__buttons">
              <main-button
                type="button"
                class="right-attached-panel__save"
                :class="{ button_disabled: selectedEmployee.workTemplate && !templateStartDate }"
                @click="saveEmployeeDebounced"
              >
                {{ selectedEmployeeTemplate ? 'Назначить' : 'Сохранить' }}
              </main-button>
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
      content-class="right-attached-panel businesscard-form templates"
      transition="slide"
      @input="closeTemplatesList"
    >
      <v-layout class="right-attached-panel__container">
        <button
          type="button"
          class="right-attached-panel__close"
          @click="closeTemplatesList"
        />
        <div class="right-attached-panel__content">
          <div class="right-attached-panel__header">
            Редактирование списка шаблонов
          </div>
          <template v-if="isEditing">
            <TemplateEdit
              :template="editingTemplate"
              @cancel="isEditing = false; editingTemplate = {}"
              @saved="onBusinessTemplateSaved"
            />
          </template>
          <template v-else>
            <div v-if="newBusiness && newBusiness.j" class="templates-list">
              <div class="templates-list__content">
                <TemplateCard
                  v-for="(template, i) in newBusiness.j.scheduleTemplates"
                  :key="i"
                  :editable="true"
                  :selectable="false"
                  :template="template"
                  @edit="openEditForm(template)"
                  @delete="deletingTemplate = template; showDelete = true"
                />
              </div>
            </div>
            <div class="right-attached-panel__buttons">
              <button
                type="button"
                class="right-attached-panel__save"
                @click="saveTemplatesListDebounced"
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
          </template>
        </div>
      </v-layout>
    </v-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { cloneDeep, debounce, isEqual } from 'lodash'
import { employeesCategorized } from '~/mixins/employee'
import { dayScheduleMixin } from '~/mixins/dayScheduleMixin'
import Modal from '~/components/common/Modal'
import Accordion from '~/components/common/Accordion'
import Chip from '~/components/common/Chip.vue'
import EmployeesSelection from '~/components/employee/EmployeesSelection.vue'
import EmployeeSimpleCard from '~/components/employee/EmployeeSimpleCard.vue'
import MainButton from '~/components/common/MainButton.vue'
import TemplateCard from '~/components/employee/TemplateCard.vue'
import TemplateEdit from '~/components/employee/TemplateEdit.vue'
import TimeEdit from '~/components/TimeEdit.vue'
import Business from '~/classes/business'
import Employee from '~/classes/employee'
import { formatDate, getWeeks, hyphensStringToDate } from '~/components/calendar/utils'
import Api from '~/api/backend'
import { makeAlert } from '~/api/utils'

export default {
  // eslint-disable-next-line standard/object-curly-even-spacing
  components: { Accordion, Chip, EmployeesSelection, EmployeeSimpleCard, MainButton, Modal, TemplateCard, TemplateEdit, TimeEdit },
  mixins: [ dayScheduleMixin, employeesCategorized ],
  data () {
    return {
      changeWeekDirection: 0,
      editingTemplate: {},
      dayScheduleErrors: [],
      deletingTemplate: null,
      isStillEditing: false,
      enabled: null,
      isCreating: false,
      isEditing: false,
      lastEdited: '',
      lastParams: '',
      newBusiness: {},
      oldWorkingDays: null,
      selectedDate: '',
      selectedEmployee: null,
      selectedOnStart: false,
      showModal: false,
      showDelete: false,
      showReset: false,
      templateAssignForm: false,
      templatesListEdit: false,
      templateStartDate: '',
      workingDays: {},
      visibleEmployees: [],
      resetModalTemplate: {
        leftButton: 'ОТМЕНА',
        rightButton: 'ПРИНЯТЬ',
      },
      saveTableTemplate: {
        leftButton: 'ПЕРЕЙТИ',
        rightButton: 'СОХРАНИТЬ',
      },
      showChangeWeekModal: false,
      deleteModalTemplate: {
        leftButton: 'ОТМЕНА',
        rightButton: 'УДАЛИТЬ',
      },
      rules: {
        uniqueTitle: value => !this.businessInfo.scheduleTemplates.some(t => t.title === value) || 'Название шаблона должно быть уникально',
      },
    }
  },
  computed: {
    ...mapGetters({
      actualDate: 'common/actualDate',
    }),
    businessTemplates () {
      if (!this.businessInfo.scheduleTemplates) {
        return []
      }
      return this.businessInfo.scheduleTemplates
    },
    selectedEmployeeTemplate () {
      if (!this.selectedEmployee) {
        return
      }
      const template = this.getEmployeeTemplate(this.selectedEmployee)
      let computedTemplate

      if (template) {
        computedTemplate = {
          ...template,
          startDate: this.selectedEmployee.j.workTemplate.startDate,
        }
      }

      return computedTemplate
    },
    selectedWeek () {
      if (!this.selectedDate) { return [] }

      const includesDay = day => day.dateKey === this.selectedDate

      return this.selectedMonth.find(week => week.some(includesDay))
    },
    selectedMonth () {
      return getWeeks(+this.selectedDate.slice(0, 4), +this.selectedDate.slice(5, 7) - 1)
    },
    startDayFormatted () {
      if (!this.selectedEmployeeTemplate) { return '' }
      const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'short',
      }
      return hyphensStringToDate(this.selectedEmployeeTemplate.startDate).toLocaleString(
        'ru',
        options
      )
    },
  },
  watch: {
    'businessInfo.id': {
      handler: 'getWorkingDays',
    },
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
    selectedWeek: {
      handler: 'getWorkingDays',
      deep: true,
    },
  },
  created () {
    this.selectedDate = this.actualDate
    this.saveEmployeeDebounced = debounce(this.saveEmployee, 300)
    this.saveTemplatesListDebounced = debounce(this.saveTemplatesList, 300)
    this.saveTableDebounced = debounce(this.saveTable, 300)
    this.fillTableDebounced = debounce(this.fillTable, 300)
    this.showTemplatesListEditDebounced = debounce(this.showTemplatesListEdit, 300)
  },
  beforeMount () {
    this.templateStartDate = this.actualDate
    this.initVisibleEmployees()
    this.getWorkingDays()
  },
  methods: {
    ...mapActions({
      alert: 'alerts/alert',
      saveBusiness: 'business/saveBusiness',
      addEmployeeItem: 'employee/addEmployeeItem',
    }),
    changeWeek (vector) {
      const dt = new Date(this.selectedDate)

      this.changeWeekDirection = vector
      if (this.isChanged()) {
        this.showChangeWeekModal = true
        return
      }
      dt.setDate(dt.getDate() + 7 * vector)
      this.selectedDate = formatDate(dt)
    },
    addVisibleEmployee (e) {
      this.visibleEmployees.push(e)
      this.visibleEmployees.sort(this.compareByName)
    },
    assignTemplate (template, isChecked) {
      this.selectedEmployee.j.workTemplate = template && isChecked
        ? cloneDeep(template)
        : {}
    },
    closeAssignForm () {
      this.templateAssignForm = false
      this.isCreating = false
      this.isEditing = false
      this.templateStartDate = this.actualDate
    },
    closeTemplatesList () {
      this.newBusiness = {}
      this.templatesListEdit = false
      this.isEditing = false
    },
    getDiffInDays (first, second) {
      return Math.floor((second - first) / (1000 * 60 * 60 * 24))
    },
    deleteBusinessTemplate (temp) {
      const templates = this.newBusiness.scheduleTemplates
      const index = templates.findIndex(t => t.title === temp.title)

      templates.splice(index, 1)
    },
    deleteEmpTemplate () {
      this.assignTemplate(null, false)
    },
    fillTable () {
      this.visibleEmployees.forEach((employee) => {
        if (employee.j.workTemplate && employee.j.workTemplate.type) {
          this.$set(this.workingDays, employee.id, this.getEmpWeekSchedule(employee))
        }
      })
    },
    fillWithEmpty () {
      this.businessEmployees.forEach((emp) => {
        if (!this.workingDays[emp.id]) {
          this.$set(this.workingDays, emp.id, this.selectedWeek.map(d => ({ date: d.dateKey, employeeId: emp.id, start: '', end: '' })))
        } else {
          this.workingDays[emp.id] = this.selectedWeek.map(d => ({ date: d.dateKey, employeeId: emp.id, start: '', end: '' }))
        }
      })
    },
    getHyphenedDate (dotDateString) {
      const arr = dotDateString.split('.')
      if (dotDateString.includes('-')) {
        return dotDateString
      }
      return `${arr[2]}-${arr[1]}-${arr[0]}`
    },
    getMaskedDate (dateString) {
      const arr = dateString.split('-')
      if (dateString.includes('.')) {
        return dateString
      }
      return `${arr[2]}.${arr[1]}.${arr[0]}`
    },
    getEmpWeekSchedule (employee) {
      const empty = this.selectedWeek.map(d => ({ date: d.dateKey, employeeId: employee.id, start: '', end: '' }))

      if (employee.j.workTemplate && employee.j.workTemplate.type) {
        const template = this.getEmployeeTemplate(employee)
        if (template.type === 'week') {
          const startDate = employee.j.workTemplate.startDate
          if (this.selectedWeek[0].dateKey > startDate) {
            return this.selectedWeek.map((d, index) => ({ date: d.dateKey, employeeId: employee.id, start: template.data[index].start, end: template.data[index].end }))
          } else {
            return this.selectedWeek.map((d, index) => {
              return d.dateKey < startDate
                ? { date: d.dateKey, employeeId: employee.id, start: '', end: '' }
                : { date: d.dateKey, employeeId: employee.id, start: template.data[index].start, end: template.data[index].end }
            })
          }
        }

        const period = template.data.length
        const startDate = hyphensStringToDate(employee.j.workTemplate.startDate) // startDate is not a common info
        const thisMonday = this.selectedWeek[0].date
        // eslint-disable-next-line prefer-const
        let week = empty

        if (!startDate) {
          return empty
        }

        if (startDate < thisMonday) {
          const diff = this.getDiffInDays(startDate, thisMonday)
          let currentDay = diff % period

          for (let i = 0; i < 7; i++) {
            week[i] = Object.assign(week[i], template.data[currentDay])
            currentDay = currentDay < (period - 1) ? (currentDay + 1) : 0
          }
        } else {
          for (let i = 0; i < 7; i++) {
            if (this.selectedWeek[i].date < startDate) {
              week[i] = Object.assign(week[i], { start: '', end: '' })
            } else {
              for (let j = 0; (j < period) && i < 7; j++) {
                week[i] = Object.assign(week[i], template.data[j])
                i++
              }
            }
          }
        }

        return week
      } else {
        return empty
      }
    },
    getWorkingDays () {
      if (!this.selectedWeek || !this.businessInfo.id) {
        return
      }

      const params = `parent_business_id=eq.${this.businessInfo.id}&dt=gte.${this.selectedWeek[0].dateKey}&dt=lte.${this.selectedWeek[6].dateKey}&order=business_id,dt`
      if (this.lastParams === params) {
        return
      }

      this.lastParams = params
      Api()
        .get(
          `/business_calendar?${params}`
        )
        .then(({ data }) => {
          if (!data.length) {
            this.fillWithEmpty()
            return
          }
          const res = data.map((x) => {
            return x.j.schedule
              ? {
                date: x.dt,
                start: x.j.schedule[0],
                end: x.j.schedule[1],
                employeeId: x.business_id,
              }
              : {
                date: x.dt,
                start: '',
                end: '',
                employeeId: x.business_id,
              }
          })

          this.businessEmployees.forEach((employee) => {
            if (!this.workingDays[employee.id]) {
              this.$set(this.workingDays, employee.id, [])
            } else {
              this.workingDays[employee.id] = []
            }
          })
          res.forEach((el) => {
            if (!el.start) {
              el.start = ''
            }
            if (!el.end) {
              el.end = ''
            }
            if (!this.workingDays[el.employeeId]) {
              this.$set(this.workingDays, el.employeeId, [])
            }
            this.workingDays[el.employeeId].push(el)
          })
          this.oldWorkingDays = cloneDeep(this.workingDays)
        })
    },
    initVisibleEmployees () {
      this.businessEmployees.forEach((employee) => {
        if (!this.workingDays[employee.id]) {
          this.$set(this.workingDays, employee.id, [])
        }
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
    isChanged () {
      return this.oldWorkingDays && !isEqual(this.oldWorkingDays, this.workingDays)
    },
    loadPerDay (day) {
      // eslint-disable-next-line prefer-const
      let res = {}
      let start = []

      if (!Object.keys(this.workingDays).length) {
        return 0
      }
      for (const empId in this.workingDays) {
        if (!this.workingDays[empId].length) {
          return
        }
        start = start.concat(this.workingDays[empId])
      }

      this.selectedWeek.forEach((d) => {
        const hyphenDate = d.dateKey
        res[hyphenDate] = start.filter(x => x.date === hyphenDate && x.start && x.end).length
      })

      return res[day]
    },
    onInputDate (newVal) {
      if (this.validateDate(newVal) === true) {
        this.templateStartDate = newVal
      } else {
        this.templateStartDate = ''
      }
    },
    onSelectTemplate (template, isChecked) {
      this.assignTemplate(template, isChecked)
      this.selectedEmployee.j.workTemplate.startDate = this.selectedDate
      if (!this.templateStartDate) {
        this.templateStartDate = this.selectedDate
      }
    },
    openAssignForm (employee) {
      this.selectedEmployee = new Employee(cloneDeep(employee))
      this.templateAssignForm = true
      this.templateStartDate = employee.j.workTemplate && employee.j.workTemplate.startDate
      if (!this.templateStartDate) {
        this.templateStartDate = this.selectedDate
      }
    },
    openEditForm (template) {
      this.isEditing = true
      if (template) {
        this.editingTemplate = template
      }
    },
    onBusinessTemplateSaved () {
      this.newBusiness = new Business(cloneDeep(this.businessInfo))
      this.isEditing = false
    },
    onClick (date, employeeId, target) {
      if (this.dayScheduleErrors.length && this.lastEdited !== date + employeeId) {
        return
      }
      this.enabled = date + employeeId
      this.lastEdited = date + employeeId
      const input = this.$refs[date + employeeId][0].$el.querySelector('input')
      if (target.nodeName === 'INPUT') {
        target.disabled = false
        target.focus()
      } else {
        input.disabled = false
        input.focus()
      }
    },
    onEmployeeTemplateSaved (newTemplate) {
      this.templateStartDate = newTemplate.startDate
      this.isCreating = false
      this.isEditing = false
      this.assignTemplate(newTemplate, true)
    },
    resetChanges () {
      this.workingDays = cloneDeep(this.oldWorkingDays)
    },
    saveAndGo () {
      this.showChangeWeekModal = false
      this.saveTable()
        .then(() => {
          debugger
          this.changeWeek(this.changeWeekDirection)
        })
    },
    saveEmployee () {
      if (this.selectedEmployee.j.workTemplate) {
        // at this moment workTemplate is already in store (in business' templates)
        // We should not save workTemplate.data in employee, but keep it in business,
        // so that after any change in a common template, it doesn't need to change
        // the corresponding data in employee
        this.selectedEmployee.j.workTemplate = cloneDeep(this.selectedEmployee.j.workTemplate)
        this.selectedEmployee.j.workTemplate.data = null
        this.selectedEmployee.j.workTemplate.startDate = this.getHyphenedDate(this.templateStartDate)
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
          this.businessEmployees.forEach((e) => {
            // we have to check all employees
            // in case of some common templates were deleted
            if (!this.getEmployeeTemplate(e)) {
              const newEmp = new Employee(cloneDeep(e))
              newEmp.workTemplate = null
              newEmp.save()
                .then((res) => {
                  this.addEmployeeItem(res)
                  this.updateVisibleEmployees()
                })
                .catch(e => this.alert(makeAlert(e)))
            }
          })
          this.templatesListEdit = false
        })
    },
    saveTable () {
      const data = []

      this.visibleEmployees.forEach((e) => {
        this.selectedWeek.forEach((d, dayIndex) => {
          const daySchedule = this.workingDays[e.id][dayIndex]
          data.push({
            business_id: e.id,
            dt: d.dateKey.replace(/-/g, ''),
            j: {
              schedule: [ daySchedule.start, daySchedule.end ],
            },
          })
        })
      })

      return Api()
        .post(`/business_calendar?branch_id=eq.${this.businessInfo.id}`, data)
        .then(() => {
          this.oldWorkingDays = cloneDeep(this.workingDays)
        })
    },
    showTemplatesListEdit () {
      this.newBusiness = new Business(cloneDeep(this.businessInfo))
      this.templatesListEdit = true
    },
    validateDate (dottedValue) {
      const dateFormat = /^(0?[1-9]|[12][0-9]|3[01])\.(0?[1-9]|1[012])\.(19\d{2}|20\d{2})$/
      // eslint-disable-next-line prefer-const
      let today = new Date()
      let match

      today.setHours(0, 0, 0)

      if (!dottedValue) {
        return false
      }

      // eslint-disable-next-line prefer-const
      match = dottedValue.match(dateFormat)

      if (!match) {
        return 'Неправильная дата'
      }
      const day = match[1]
      const month = match[2]
      const year = match[3]
      const monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ]

      // Adjust for leap years
      if (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0)) {
        monthLength[1] = 29
      }

      // Check the range of the day
      if (day > monthLength[month - 1]) {
        return 'Неправильная дата'
      }

      // eslint-disable-next-line prefer-const
      let date = new Date()

      date.setHours(0, 0, 0)
      date.setDate(day)
      date.setMonth(month - 1)
      date.setFullYear(year)

      if (date >= today) {
        return true
      } else {
        return 'Укажите будущую дату'
      }
    },
    changeDateSchedule (employeeId, i, data, isStart) {
      this.workingDays[employeeId][i][isStart ? 'start' : 'end'] = data
      this.dayScheduleErrors = this.getDayScheduleErrors(this.workingDays[employeeId][i])
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
      if (!this.workingDays[employee.id]) {
        return {
          hours: 0,
          minutes: 0,
        }
      }

      this.workingDays[employee.id].forEach((d) => {
        if (!d) {
          return
        }
        total += d.start && d.end ? this.getTimeDiff(d.start, d.end) : 0
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
    empWorkDaysCount (employee) {
      if (!this.workingDays[employee.id]) {
        return 0
      }
      return this.workDaysCount(this.workingDays[employee.id])
    },
    workDaysCount (days) {
      const working = days.filter(d => (d.start && d.end))
      return working ? working.length : 0
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
  %round-arrow-button {
    min-width: 0;
    width: 24px;
    height: 24px;
    margin: 0 5px;
    border: 1px solid rgba(137, 149, 175, 0.1);
    border-radius: 50%;
    color: #8995af;
    background: url('~assets/images/down.png') center no-repeat;
    transform: rotate(90deg);
  }
  $time-input-width: 96px;

  .important-text {
    font-weight: 600;
  }
  .employees-schedule {
    background-color: #fff;
    .fill-table {
      width: 285px;
      height: 40px;
      background: #5699FF;
      font-family: Roboto Slab, serif;
      font-size: 14px;
      text-align: center;
      color: #FFFFFF;
      outline: none;
    }
    .change-week {
      display: flex;
      align-items: center;
      margin-left: 15px;
    }
    .change-week__button {
      @extend %round-arrow-button;
      color: #8995af !important;
      &:hover {
        background-color: rgba(137, 149, 175, 0.1);
      }
      &.right {
        transform: rotate(-90deg);
      }
    }
    .week-days {
      margin-left: 15px;
      font-family: Roboto Slab, serif;
      font-size: 18px;
    }
    .v-bottom-nav {
      justify-content: flex-end;
      align-items: center;
      padding: 12px 42px;
      & > * {
        flex-grow: 0;
      }
      span {
        font-size: 16px;
        font-weight: 600;
      }
      .save-table {
        margin-left: 42px;
      }
    }

    table {
      max-width: 1084px;
      border-collapse: collapse;
      text-align: center;
      border-top: 1px solid #d6dae3;
    }
    tr {
      border-bottom: 1px solid #d6dae3;
      border-right: 1px solid #d6dae3;
    }
    &__reset {
      font-family: Roboto Slab, serif;
      color: #5699FF;
      outline: none;
      &:before {
        display: inline-block;
        vertical-align: middle;
        width: 16px;
        height: 16px;
        margin-right: 5px;
        background: url('~assets/images/svg/arrow_down.svg') center no-repeat;
        content: '';
      }
    }
    &__empty {
      width: 100%;
      height: 40px;
      font-family: Roboto Slab, serif;
      color: #fff;
      background: #07101C;
      &:before {
        display: inline-block;
        vertical-align: sub;
        width: 16px;
        height: 16px;
        margin-right: 5px;
        background: url('~assets/images/svg/close.svg') center no-repeat;
        content: '';
      }
    }
    &__employees {
      width: 190px;
    }
    .table-header {
      font-weight: 600;
      font-size: 16px;
    }
    &__template-column {
      width: 150px;
      padding: 0 20px;
      font-weight: 600;
      font-size: 16px;
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
    &__footer {
      height: 40px;
    }
    &__modal-text {
      width: 80%;
      margin: 0 auto;
    }
    .templates-list-edit {
      width: 56px;
      height: 40px;
      border-left: 1px solid rgba(137, 149, 175, 0.35);
      background: url('~assets/images/svg/pencil.svg') center no-repeat  rgba(137, 149, 175, 0.5);
      outline: none;
    }
    .bottom-placeholder {
      height: 90px;
    }
  }
  .schedule-row {
    color: #07101C;
    &__data-cell {
      min-width: 72px;
      @include border-left();

      &.day-off {
        background-color: rgba(137, 149, 175, 0.1);
        &:hover {
          background: url('~assets/images/svg/plus.svg') center no-repeat rgba(137, 149, 175, 0.1);
        }
        input::placeholder {
          color: transparent !important;
        }
      }
      &.editing {
        background: #fff;
        &:hover {
          background: #fff;
        }
        input::placeholder {
          color: #8995AF !important;
        }
      }
      &.past {
        pointer-events: none;
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
    .time-edit {
      input {
        width: 100%;
        text-align: center;
        background-color: transparent;
        font-weight: 600;
        &::placeholder {
          font-weight: 600 !important;
          font-size: 16px;
        }
      }
      &.v-input--is-disabled input {
        color: #07101C;
      }
    }
    &.has-errors {
      .day-off:hover {
        background: rgba(137, 149, 175, 0.1);
      }
    }
  }
  .templates {
    &__shift-days {
      padding-bottom: 20px;
      border-bottom: 1px solid rgba(137, 149, 175, 0.1);
    }
    &__days {
      width: 200px;
      margin: 4px auto 0;
    }
    &__input {
      max-width: 49px;
      input::placeholder {
        font-size: 14px;
      }
    }
    &__times-inputs {
      margin-top: 20px;
      padding-left: 27px;
    }
    &__heading {
      max-width: 213px;
      margin-bottom: 17px;
    }
    &__date {
      border-top: 1px solid rgba(137, 149, 175, 0.1);
    }
    &__days-off {
      padding-right: 23px;
    }
    &__day-off {
      width: $time-input-width;
      margin: 7px 0;
      padding: 0 13px;
      color: #8995AF;
      border-left: 1px solid;
      border-right: 1px solid;
    }
    .right-attached-panel__content {
      width: 265px;
    }
    .accordion {
      padding: 40px 0 0;
    }
    .accordion.current-template .accordion__header:after,
    .accordion.templates__available .accordion__header:after {
      display: none;
    }
    .current-template {
      &__start {
        border-top: 1px solid rgba(137, 149, 175, 0.1);
        padding: 30px 16px 20px;
        font-size: 12px;
      }
      &__text {
        font-weight: 600;
      }
    }
    .checkbox {
      margin-top: 30px;
    }
    .checkbox__label {
      margin-bottom: 0;
    }

    button {
      outline: none;
    }
    .employees-schedule__warning {
      margin: 32px auto 24px;
      width: 217px;
    }
    .business-schedule__main {
      padding: 0;
    }
    .day-schedule__times {
      width: $time-input-width;
    }
    .time-edit input {
      padding-bottom: 0;
    }
  }
</style>
