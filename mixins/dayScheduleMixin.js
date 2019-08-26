export const dayScheduleMixin = {
  methods: {
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
