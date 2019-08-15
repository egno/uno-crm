<template>
  <div class="employees-schedule">
    <div>

    </div>
    <table>
      <thead>
        <tr>
          <td class="employees-schedule__employees">
            <v-layout justify-space-between>
              <EmployeesSelection
                :visible-employees="visibleEmployees"
                :show-category-checkbox="true"
                @addVisibleEmployee="visibleEmployees.push($event)"
                @removeVisibleEmployee="removeVisibleEmployee"
              />
              <div>Все мастера</div>
            </v-layout>
          </td>
          <td class="employees-schedule__template-column">Активные шаблоны</td>
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
      </v-layout>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { employeesCategorized } from '~/mixins/employee'
import ScheduleRow from '~/components/employee/ScheduleRow'
// import Modal from '~/components/common/Modal'
import EmployeesSelection from '~/components/employee/EmployeesSelection.vue'
// import { hyphensStringToDate, } from '~/components/calendar/utils'
export default {
  // eslint-disable-next-line standard/object-curly-even-spacing
  components: { ScheduleRow, EmployeesSelection },
  mixins: [ employeesCategorized ],
  data () {
    return {
      selectedDate: '',
      templateFormVisible: false,
      visibleEmployees: [],
    }
  },
  computed: {
    ...mapGetters({
      actualDate: 'common/actualDate',
      calendarMonth: 'common/calendarMonth',
    }),
    selectedWeek () {
      if (!this.selectedDate) { return [] }

      const includesDay = day => day.dateKey === this.selectedDate

      return this.calendarMonth.find(week => week.some(includesDay))
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
    assignTemplate (employee) {
      this.templateFormVisible = true
    },
    datesDiff (first, second) {
      return Math.floor((second - first) / (1000 * 60 * 60 * 24))
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
  },
}
</script>

<style lang="scss">
  @import '~assets/styles/right-attached-panel.scss';
  .employees-schedule {
    background-color: #fff;
    table {
      max-width: 1084px;
      border-collapse: collapse;
      text-align: center;
    }
    tr {
      border-bottom: 1px solid rgba(137, 149, 175, 0.35);
    }
    &__employees {
      width: 190px;
    }
    &__template-column {
      width: 150px;
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
  }
  .schedule-row {
    color: #07101C;
    &__data-cell {
      min-width: 72px;
      border-left: 1px solid  rgba(137, 149, 175, 0.35);
      input {
        width: 100%;
        text-align: center;
      }
      .grey {
        background-color: rgba(137, 149, 175, 0.1);
      }
      &.last {
        border-right: 1px solid rgba(137, 149, 175, 0.35);
      }
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
