export function fullName (obj) {
  return obj && obj.j && [obj.j.name, obj.j.surname].filter(x => !!x).join(' ')
}

export function serviceInit (service) {
  return {
    ...{ group: undefined, price: 0, duration: 60, notes: undefined },
    ...(typeof service !== 'object' ? { name: service } : service)
  }
}

/* for check if 2 days in schedule are same  */
export function areDaysSame (day, nextDay) {
  if (Object.keys(day).length !== Object.keys(nextDay).length) {
    return false
  }

  return day.start === nextDay.start && day.end === nextDay.end
}

/* for check if the day is already in one of the groups of schedule.
 * Group - is an array of days with same schedule */
export function isInGroups (groups, day) {
  if (!groups.length) {
    return false
  }
  return groups.some(d => areDaysSame(d, day))
}
