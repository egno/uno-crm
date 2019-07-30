import Api from '@/api/backend'
import { mapGetters, mapActions, mapMutations } from 'vuex'
import { formatDate, getWeeks, monthDisplay } from '@/components/calendar/utils'
import Visit from '@/classes/visit'

export default {
  data () {
    return {
      activeSlide: 0,
      isLoading: false,
      visits: [],
    }
  },
  computed: {
    ...mapGetters({
      actualDate: 'common/actualDate',
      businessId: 'business/businessId',
      calendarMonth: 'common/calendarMonth'
    }),
    dateMonthHeader () {
      const d = new Date(this.selectedDate)
      return monthDisplay(d)
    },
    selectedDate () {
      return this.actualDate || this.$route.params.date
    },
    selectedWeek () {
      if (!this.selectedDate) return []

      return this.getWeek()
    },
    workMonth () {
      return +this.selectedDate.slice(5, 7) - 1
    },
    workYear () {
      return +this.selectedDate.slice(0, 4)
    }
  },
  mounted () {
    this.setDates()
  },
  methods: {
    ...mapMutations({
      SET_CALENDAR_MONTH: 'common/SET_CALENDAR_MONTH'
    }),
    ...mapActions({ setActualDate: 'common/setActualDate' }),
    addMonth (i) {
      let dt = new Date(this.actualDate)
      dt.setMonth(dt.getMonth() + i)
      this.goDate(formatDate(dt))
    },
    dayVisits (dt, employee) {
      if (!this.visits || !this.visits.length) {
        return []
      }

      let filtered = this.visits.filter(v => (v.ts_begin.slice(0, 10) === dt) && (employee ? v.business_id === employee.id : v.business_id === this.businessId))

      return filtered
        .sort((a, b) => (a.ts_begin < b.ts_begin ? -1 : 1))
        .map(x => {
          let ts1 = new Date(x.ts_begin)
          let ts2 = new Date(x.ts_end)

          x.j.duration = (ts2.getTime() - ts1.getTime()) / 60000
          return x
        })
    },
    fetchData () {
      if (!this.$route || !this.$route.params || !this.$route.params.id) return

      if (!this.selectedWeek) return

      const sunday = this.selectedWeek[6]
      const nextMonday = new Date(sunday.date)
      nextMonday.setDate(sunday.date.getDate() + 1)
      this.isLoading = true
      Api()
        .get(`/visit?salon_id=eq.${this.$route.params.id}&ts_begin=gt.${this.selectedWeek[0].dateKey}&ts_begin=lt.${formatDate(nextMonday)}`)
        .then(({ data }) => {
          this.visits = data.map(v => new Visit(v))
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    getWeek () {
      const includesDay = day => day.dateKey === this.selectedDate

      // todo make a separate method for changing active slide
      this.activeSlide = this.calendarMonth.findIndex(week => week.some(includesDay))

      return this.calendarMonth[this.activeSlide]
    },
    isHoliday (dt, employee) {
      if (!dt || !this.selectedWeek) {
        return false
      }
      const dow = this.selectedWeek.findIndex(d => d.dateKey === dt)
      const irregularDay = this.getIrregularDay(dt, employee)

      if (this.irregularDays.length && (this.irregularDays[0].employeeId !== employee.id)) { // todo check if correct
        return false
      }

      if (!irregularDay && !employee) {
        return false
      }

      return irregularDay
        ? !irregularDay.schedule.length
        : !employee.j.schedule.data[dow].length || !employee.j.schedule.data[dow][1]
    },
    getIrregularDay (dt, employee) {
      if (!employee) {
        return
      }
      return this.irregularDays.find(d => d.date === dt && d.employeeId === employee.id)
    },
    goDate (dt) {
      this.setActualDate(dt)
    },
    setDates () {
      this.SET_CALENDAR_MONTH(getWeeks(this.workYear, this.workMonth))
      if (this.period === 'week') {
        this.SET_CALENDAR_MONTH(this.calendarMonth.filter(w =>
          w.some(d => d.dateKey === this.selectedDate)
        ))
      }
    },
  }
}
