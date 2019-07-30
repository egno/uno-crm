
class ScheduleDay {
  constructor (newVal) {
    if (Array.isArray(newVal)) {
      this.start = newVal[0]
      this.end = newVal[newVal.length - 1]
    } else {
      this.start = newVal.start
      this.end = newVal.end
    }
  }
}

export default ScheduleDay
