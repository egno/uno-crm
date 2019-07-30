import ScheduleDay from './scheduleDay'

class BusinessSchedule {
  constructor ({ type, data }) {
    if (!type || !data) {
      this.type = 'week'
      this.data = []

      for (let i = 0; i < 7; i++) {
        this.data.push(new ScheduleDay({ start: '', end: '' }))
      }
      return
    }

    this.data = data.map(x => new ScheduleDay(x))
    this.type = type
  }
}

export default BusinessSchedule
