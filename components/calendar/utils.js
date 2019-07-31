import Visit from '~/classes/visit'

// Safari fix
export function dateFromISO (s) {
  const a = s.split(/[^0-9]/)
  const d = new Date(a[0], a[1] - 1, a[2], a[3], a[4], a[5])
  return d
}

export function dateInTimeZone (date, tz) {
  if (!tz) {
    return date
  }
  const d = new Date(date)
  const utc = d.getTime() + d.getTimezoneOffset() * 60000
  return new Date(utc + 60000 * tz)
}

export function dateInLocalTimeZone (date) {
  const d = new Date(date)
  const l = d.getTime() - d.getTimezoneOffset() * 60000
  return new Date(l)
}

export function fixLocalTimeZone (date, tz) {
  if (!tz) {
    return date
  }
  const d = new Date(date)
  const utc = d.getTime() - d.getTimezoneOffset() * 60000
  return new Date(utc - 60000 * tz)
}

export function getISOTimeZoneOffset (s) {
  const t = s.slice(-6)
  return +(t.slice(0, 1) + '1') * (+t.slice(1, 3) * 60 + +t.slice(-2))
}

export function getISODate (s) {
  const t = s.slice(-6)
  return +(t.slice(0, 1) + '1') * (+t.slice(1, 3) * 60 + +t.slice(-2))
}

export function valueDate (value) {
  return value ? dateFromISO(value).getTime() : undefined
}

// converts Date instance to yyyy-mm-dd String
export function formatDate (date) {
  if (!date) { return }
  const d = date
  return [
    d.getFullYear(),
    ('0' + (d.getMonth() + 1)).slice(-2),
    ('0' + d.getDate()).slice(-2)
  ].join('-')
}

// converts Date instance to dd.mm.yyyy String
function displayDate (date) {
  if (!date) { return }
  const d = date
  return [
    ('0' + d.getDate()).slice(-2),
    ('0' + (d.getMonth() + 1)).slice(-2),
    d.getFullYear()
  ].join('.')
}

export function formatTime (date) {
  if (!date) { return }
  const d = date

  return [
    ('0' + d.getHours()).slice(-2),
    ('0' + d.getMinutes()).slice(-2)
  ].join(':')
}

export function areSameDates (date1, date2) {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  )
}

function splitArray (inputArray, chunkSize) {
  const results = []
  while (inputArray.length) {
    results.push(inputArray.splice(0, chunkSize))
  }
  return results
}

export function getRESTTime (s) {
  if (!s) {
    return
  }
  return s.slice(11, 16)
}

export function displayRESTDate (s) {
  if (!s) {
    return
  }
  const d = dateFromISO(s)
  return displayDate(d)
}

export function displayRESTTime (s) {
  if (!s) {
    return
  }
  const d = dateFromISO(s)
  return formatTime(d)
}

export function getWeeks (year, month) {
  const days = []
  const date = new Date(year, month, 1)
  const today = new Date()
  // append prev month dates
  const startDay = date.getDay() || 7

  if (startDay > 1) {
    for (let i = startDay - 2; i >= 0; i--) {
      const prevDate = new Date(date)
      prevDate.setDate(-i)
      days.push({ outOfRange: true, date: prevDate })
    }
  }
  while (date.getMonth() === month) {
    days.push({ date: new Date(date) })
    date.setDate(date.getDate() + 1)
  }

  // append next month dates
  const daysLeft = 7 - (days.length % 7)
  if (daysLeft < 7) {
    for (let i = 1; i <= daysLeft; i++) {
      const nextDate = new Date(date)
      nextDate.setDate(i)
      days.push({ outOfRange: true, date: nextDate })
    }
  }

  // define day states
  days.forEach((day) => {
    day.today = areSameDates(day.date, today)
    day.display = day.date.getDate()
    day.dateKey = formatDate(day.date)
  })

  return splitArray(days, 7)
}

export function visitInit (visit) {
  return new Visit(visit)
}

export function dowDisplay (dt, format = 0) {
  const dow = [
    ['воскресенье', 'вс'],
    ['понедельник', 'пн'],
    ['вторник', 'вт'],
    ['среда', 'ср'],
    ['четверг', 'чт'],
    ['пятница', 'пт'],
    ['суббота', 'сб']
  ]
  return dow[dt.getDay()][format]
}

export function monthDisplay (dt) {
  return dt.toLocaleString('ru-RU', { month: 'long' }) + ' ' + dt.getFullYear()
}

export function visitStatus (status, time) {
  const s = {
    unvisited: 'Не пришел'
  }
  const now = new Date()
  const t = dateFromISO(time)

  return s[status] || t - now > 0 ? 'Запись' : 'Завершен'
}

// converts yyyy-mm-dd String to Date instance
export function hyphensStringToDate (str) {
  if (!str) { return }

  const arr = str.split('-')
  const year = arr[0]
  const month = arr[1] - 1
  const day = arr[2]

  return new Date(year, month, day)
}

/* converts yyyy-mm-dd String to {
    date: Date,
    today: Boolean,
    display: Number,
    dateKey: String
  } Object
*/
export function hyphenStrToDay (str) {
  if (!str) { return }

  const today = new Date()
  const day = {
    date: hyphensStringToDate(str)
  }

  day.today = areSameDates(day.date, today)
  day.display = day.date.getDate() // day of month
  day.dateKey = formatDate(day.date) // yyyy-mm-dd

  return day
}

// format 2019-05-17T14:58:11
export function dateISOInLocalTimeZone (date) {
  const d = new Date(date)
  const l = d.getTime() - d.getTimezoneOffset() * 60000
  const dl = new Date(l)
  return dl.toISOString().slice(0, 19)
}

export function timestampLocalISO (diff = 30) {
  let dt = new Date()
  dt = new Date(dt.getTime() + diff * 60000)
  return dateISOInLocalTimeZone(dt)
}

export function ceilMinutes (date, interval = 15) {
  const newDate = new Date(date)
  const oldMin = date.getMinutes()
  const integerPart = Math.floor(oldMin / interval)

  return newDate.setHours(date.getHours(), integerPart * interval + interval, 0)
}
