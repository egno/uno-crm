/* eslint-disable indent */
import Vue from 'vue'
import EmployeeSimpleCard from '~/components/employee/EmployeeSimpleCard.vue'

export default Vue.component('ScheduleRow',
 {
  components: { EmployeeSimpleCard },
  props: {
    employee: {
      type: Object,
      default: () => ({}),
    },
    days: {
      type: Array,
      default: () => [],
    },
  },
  data () {
    return {
      isStillEditing: false,
      enabled: null,
    }
  },
  template: `
    <tr class="schedule-row">
      <td class="schedule-row__employee">
        <EmployeeSimpleCard :employee="employee" />
      </td>
      <td class="schedule-row__data-cell schedule-row__template">
        <template v-if="employee.j.template" />
        <div v-else>
          <span class="schedule-row__no-template">У сотрудника нет активного шаблона.</span>
          <button type="button" class="schedule-row__add-template" @click="$emit('assignTemplate', employee)">
          Назначить
          </button>
        </div>
      </td>
      <td v-for="(day , i) in days" :key="i" class="schedule-row__data-cell" @dblclick="enabled = i">
        <div :class="{ white: day[0], grey: !day[0] }">
          <input type="text" :value="day[0]" :disabled="enabled !== i" @focus="onFocus" @blur="onBlur" @change="changeDateSchedule(i, $event.target.value, true)">
          <input type="text" :value="day[1]" :disabled="enabled !== i" @focus="onFocus" @blur="onBlur" @change="changeDateSchedule(i, $event.target.value, false)">
        </div>
      </td>
      <td class="schedule-row__data-cell">
        <div>
          {{ hoursCount.hours }}ч {{ hoursCount.minutes }}м
        </div>
      </td>
      <td class="schedule-row__data-cell last">
        <div>{{ workShiftsCount }}</div>
      </td>
    </tr>
  `,
  computed: {
    hoursCount () {
      let total = 0
      this.days.forEach((d) => {
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
    workShiftsCount () {
      return this.days.filter(d => d[0] && d[1]).length
    },
  },
  methods: {
    changeDateSchedule (i, data, isStart) {
      this.$emit('changeDateSchedule', {
        i,
        data,
        isStart,
      })
    },
    getTimeDiff (start, end) {
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
  },
})
