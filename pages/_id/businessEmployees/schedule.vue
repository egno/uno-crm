<template>
  <div class="employees-schedule">
    <div />
    <table>
      <thead>
        <tr>
          <td class="employees-schedule__employees">
            <v-layout align-center justify-space-around>
              <EmployeesSelection
                :visible-employees="visibleEmployees"
                :show-category-checkbox="true"
                @addVisibleEmployee="visibleEmployees.push($event)"
                @removeVisibleEmployee="removeVisibleEmployee"
              />
              <div>Все мастера</div>
            </v-layout>
          </td>
          <td class="employees-schedule__template-column">
            Активные шаблоны
          </td>
          <td v-for="(day, dayIndex) in selectedWeek" :key="dayIndex" class="employees-schedule__cell">
            <div>
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
        <tr is="ScheduleRow"
            v-for="(employee, i) in visibleEmployees"
            :key="i"
            :employee="employee"
            :days="empWeekSchedule(employee)"
            @assignTemplate="assignTemplate"
        />
      </tbody>
    </table>
    <v-dialog
      :value="templateFormVisible"
      content-class="right-attached-panel businesscard-form _templates"
      transition="slide"
      @input="templateFormVisible = false"
    >
      <v-layout class="right-attached-panel__container">
        <button
          type="button"
          class="right-attached-panel__close"
          @click="templateFormVisible = false"
        />
        <div class="right-attached-panel__content">
          <div class="right-attached-panel__header">
            Шаблоны графика работы
          </div>
          <Chip
            id="create_template"
            v-model="isCreating"
            :checked="isCreating"
            label="Создание шаблона"
            name="create_template"
          />

          <Accordion v-if="!isCreating && templates.length">
            <template slot="heading">
              <div>Список доступных шаблонов</div>
            </template>
            <template slot="content">
              <div
                v-for="(template, i) in templates"
                :key="i"
              />
            </template>
          </Accordion>
          <template v-else-if="isCreating">
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
              <div v-show="templateType">
                Заполните рабочее время сотрудника,
                или оставьте поля пустыми, если день
                является выходным
              </div>
              <template v-if="templateType === 'week'">
                <Accordion class="employees-schedule__accordion employees-schedule__week-template">
                  <template slot="heading">
                    <span>День недели</span><span>Расписание</span>
                  </template>
                  <template slot="content">
                    <BusinessScheduleEdit
                      :show-header="false"
                      :show-tumbler="false"
                      :week-schedule="selectedEmployeeSchedule"
                      @editWeek="scheduleEdit"
                    />
                  </template>
                </Accordion>
              </template>
              <template v-else-if="templateType === 'shift'">
                <Accordion class="employees-schedule__accordion employees-schedule__shift-template">
                  <template slot="heading">
                    <span>День смены</span><span>Расписание</span>
                  </template>
                  <template slot="content">
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
                        </div>
                      </div>
                    </div>
                  </template>
                  <template slot="footer">
                    <button type="button" @click="addShiftDay">
                      +
                    </button>
                    <button type="button" @click="deleteShiftDay">
                      -
                    </button>
                  </template>
                </Accordion>
              </template>
            </div>
          </template>
        </div>
      </v-layout>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { cloneDeep } from 'lodash'
import { employeesCategorized } from '~/mixins/employee'
import ScheduleRow from '~/components/employee/ScheduleRow'
// import Modal from '~/components/common/Modal'
import Accordion from '~/components/common/Accordion'
import BusinessScheduleEdit from '~/components/business/BusinessScheduleEdit.vue'
import Chip from '~/components/common/Chip.vue'
import DaySchedule from '~/components/business/DaySchedule.vue'
import EmployeesSelection from '~/components/employee/EmployeesSelection.vue'
// import { hyphensStringToDate, } from '~/components/calendar/utils'

export default {
  // eslint-disable-next-line standard/object-curly-even-spacing
  components: { Accordion, BusinessScheduleEdit, Chip, EmployeesSelection, DaySchedule, ScheduleRow },
  mixins: [ employeesCategorized ],
  data () {
    return {
      isCreating: false,
      selectedDate: '',
      selectedEmployee: null,
      shiftDays: [ {
        start: '',
        end: '',
      } ],
      templateFormVisible: false,
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
    selectedEmployeeSchedule () {
      if (!this.selectedEmployee) {
        return
      }
      return this.selectedEmployee.j.schedule
    },
    selectedWeek () {
      if (!this.selectedDate) { return [] }

      const includesDay = day => day.dateKey === this.selectedDate

      return this.calendarMonth.find(week => week.some(includesDay))
    },
    templates () {
      return []
    },
  },
  beforeMount () {
    this.selectedDate = this.actualDate
    this.businessEmployees.forEach((employee) => {
      if (!this.visibleEmployees.some(emp => emp.id === employee.id)) {
        this.visibleEmployees.push(employee)
        if (!this.selectedCategories.includes(employee.j.category)) {
          this.selectedCategories.push(employee.j.category)
        }
      }
    })
  },
  methods: {
    addShiftDay () {
      this.shiftDays.push({
        start: '',
        end: '',
      })
    },
    assignTemplate (employee) {
      this.selectedEmployee = cloneDeep(employee)
      if (!this.selectedEmployee.j.schedule.data) {
        this.selectedEmployee.j.schedule.data = []
      }

      this.templateFormVisible = true
    },
    datesDiff (first, second) {
      return Math.floor((second - first) / (1000 * 60 * 60 * 24))
    },
    deleteShiftDay () {
      this.shiftDays.splice(-1, 1)
    },
    empWeekSchedule (employee) {
      // todo merge with irregular days
      if (employee.j.template) {
        const template = employee.j.template
        const period = template.data.length
        const startDate = template.startDate
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
      } else if (employee.j.schedule) {
        return employee.j.schedule.data
      } else {
        return []
      }
    },
    onClearDay (index) {
      this.shiftDays[index] = { start: '', end: '' }
    },
    onEditDay (dayIndex, newDay) {
      if (!this.shiftDays || !this.shiftDays.length) {
        return
      }
      this.shiftDays[dayIndex] = newDay
    },
    scheduleEdit (newWeek) {
      this.selectedEmployee.j.schedule = newWeek
    },
  },
}
</script>

<style lang="scss">
  @import '~assets/styles/common.scss';
  @import '~assets/styles/right-attached-panel.scss';
  @import '~assets/styles/dropdown-select.scss';
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
    }
    &__cell {
      width: 72px;
      height: 80px;
    }
    &__dow {
      margin-top: 16px;
    }
    &__summary {
      width: 144px;
    }
    &__accordion {
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
    }
  }
  .schedule-row {
    color: #07101C;
    &__data-cell {
      min-width: 72px;
      border-left: 1px solid  #d6dae3;
      input {
        width: 100%;
        text-align: center;
      }
      .grey {
        background-color: rgba(137, 149, 175, 0.1);
      }
      &.last {
        border-right: 1px solid #d6dae3;
      }
    }
    &__template {
      padding-top: 8px;
    }
    &__no-template {
      font-size: 12px;
      color: #8995AF;
    }
    &__add-template {
      margin-top: 5px;
      font-size: 14px;
      color: #5699FF;
    }

  }
</style>
