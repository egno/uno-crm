import BusinessSchedule from '~/classes/businessSchedule'
import Api from '~/api/backend'

export const businessMixins = {
  computed: {
    id () {
      return this.$route && this.$route.params && this.$route.params.id
    },
    employeeId () {
      return this.$route && this.$route.params && this.$route.params.employee
    },
    phones () {
      if (!(this.data && this.data.j)) {
        return []
      }
      if (!this.data.j.phones) {
        return []
      }
      if (Array.isArray(this.data.j.phones)) {
        return this.data.j.phones
      }
      return [ this.data.j.phones ]
    },
  },
  methods: {
    prependHttpToUrl (url) {
      if (url.indexOf('http://') === 0 || url.indexOf('https://') === 0) {
        return url
      } else {
        return 'http://' + url
      }
    },
    dataPrefill (data) {
      if (!data) {
        data = {}
      }
      if (!data.j) {
        data.j = {}
      }
      if (!data.j.phones) {
        data.j.phones = []
      }
      if (!data.j.links) {
        data.j.links = {
          vk: '',
          instagram: '',
          others: [ { uri: '' } ],
        }
      }
      if (!data.j.address) {
        data.j.address = {}
      }
      if (!data.j.weekSchedule) {
        data.j.weekSchedule = {}
      }
      if (Array.isArray(data.j.weekSchedule)) {
        data.j.weekSchedule = { data: data.j.weekSchedule }
      }
      if (!data.j.weekSchedule.data) {
        data.j.weekSchedule.data = [
          [ '', '' ],
          [ '', '' ],
          [ '', '' ],
          [ '', '' ],
          [ '', '' ],
          [ '', '' ],
          [ '', '' ],
        ]
      }
      return data
    },
    uuidv4 () {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (
        c
      ) {
        const r = (Math.random() * 16) | 0
        const v = c === 'x' ? r : (r & 0x3) | 0x8
        return v.toString(16)
      })
    },
  },
}

export const scheduleMixin = {
  props: {
    weekSchedule: {
      type: Object,
      default () {
        return {}
      },
    },
  },
  watch: {
    weekSchedule () {
      this.update()
      this.setDays()
    },
  },
  data () {
    return {
      dow: [
        'Понедельник',
        'Вторник',
        'Среда',
        'Четверг',
        'Пятница',
        'Суббота',
        'Воскресенье',
      ],
      newWeekSchedule:
        this.weekSchedule && new BusinessSchedule(this.weekSchedule),
      days: undefined,
    }
  },
  created () {
    this.update()
    this.setDays()
  },
  methods: {
    setDays () {
      const weekSchedule = this.newWeekSchedule && this.newWeekSchedule.data
      const days = []

      if (!weekSchedule) {
        return
      }

      this.dow.map((dayName, dayIndex) => {
        days.push({
          dayName,
          dayIndex,
          value: weekSchedule[dayIndex],
        })
      })

      this.days = days
    },
    update () {
      this.newWeekSchedule =
        this.weekSchedule && new BusinessSchedule(this.weekSchedule)
    },
    getDayScheduleErrors (newDaySchedule) {
      const errors = []
      const startTime = this.getTimeArray(newDaySchedule.start)
      const endTime = this.getTimeArray(newDaySchedule.end)
      if (
        endTime[0] < startTime[0] ||
        (endTime[0] === startTime[0] && endTime[1] < startTime[1])
      ) {
        errors.push('intervalError')
      }

      if (
        !Array.isArray(newDaySchedule) &&
        ((newDaySchedule.start && !newDaySchedule.end) ||
          (!newDaySchedule.start && newDaySchedule.end))
      ) {
        errors.push('halfEmptyValueError')
      }

      if (
        Array.isArray(newDaySchedule) &&
        ((newDaySchedule[0] && !newDaySchedule[1]) ||
          (!newDaySchedule[0] && newDaySchedule[1]))
      ) {
        errors.push('halfEmptyValueError')
      }

      return errors
    },
    getTimeArray (timeString) {
      return !timeString
        ? [ null, null ]
        : timeString.split(':').map(str => parseInt(str))
    },
  },
}

export const filials = {
  methods: {
    onTabChange (newBusinessInfo) {
      if (!this.infoTab) {
        this.infoTab = true
        return
      }

      if (
        newBusinessInfo.name &&
        newBusinessInfo.j.address &&
        newBusinessInfo.j.address.name &&
        newBusinessInfo.j.phones &&
        newBusinessInfo.j.phones.length &&
        newBusinessInfo.j.phones.some(p => p.length >= 10) &&
        (!newBusinessInfo.parent || newBusinessInfo.j.category)
      ) {
        this.infoTab = false
      }
    },
    getFilialsOf (id) {
      if (!id) { return Promise.resolve([]) }
      return Api()
        .get(`business?parent=eq.${id}`)
        .then(res => res.data)
    },
  },
}
