import { displayRESTDate, displayRESTTime, dateFromISO } from '~/components/calendar/utils'

class Visit {
  constructor (val) {
    this.jsonObject = val
  }

  // Main object

  /**
   * @param {{ id: String; access: Boolean; business_id: String; j: Object; ts_begin: String; ts_end: String}} newVal
   */
  set jsonObject (newVal) {
    this.id = (newVal && newVal.id) || null
    // ATTENTION!!! business_id should contain employee's id!!!
    this.business_id = (newVal && newVal.business_id) || null
    this.client_id = (newVal && newVal.client_id) || null
    this.salon_id = (newVal && newVal.salon_id) || null
    this.ts_begin = (newVal && newVal.ts_begin) || null
    this.ts_end = (newVal && newVal.ts_end) || null
    if (newVal && newVal.j) {
      this.j = newVal.j
      this.j.notes = this.j.notes || ''
    } else {
      this.j = {
        client: {},
        services: [],
        notes: '',
      }
    }

    this.status = (newVal && newVal.status) || null
  }

  get jsonObject () {
    return this
  }

  // Properties

  set client (newVal) {
    if (newVal) {
      this.j.client = newVal
    } else {
      this.j.client = {}
    }
  }

  get client () {
    return this.j.client
  }

  get date () {
    // converts to dd.mm.yyyy String
    return this.ts_begin && displayRESTDate(this.ts_begin)
  }

  get clientName () {
    return this.j.client.name
  }

  get clientPhone () {
    return this.j.client.phone
  }

  get color () {
    return this.j.color
  }

  get isFuture () {
    const now = new Date()
    const date = dateFromISO(this.ts_begin)

    return date > now
  }

  get services () {
    return this.j.services
  }

  get statuses () {
    return [
      { display: 'Не пришел', code: 'unvisited', color: '#ef4d37' },
      { display: 'Отмена', code: 'canceled', color: '#8995AF' },
      { display: 'Завершен', done: true },
      { display: 'В процессе' },
      { display: 'Запись', color: '#5699ff' },
      { display: 'Подтвердил', code: 'confirmed', color: '#5BCD5E' },
    ]
  }

  get time () {
    return this.ts_begin && displayRESTTime(this.ts_begin)
  }

  get timeEnd () {
    return this.ts_end && displayRESTTime(this.ts_end)
  }

  get timeInterval () {
    return (
      this.ts_begin &&
      this.ts_end &&
      `${displayRESTTime(this.ts_begin)} - ${displayRESTTime(this.ts_end)}`
    )
  }

  getCurrentStatus (date = new Date()) {
    const now = date
    const t1 = dateFromISO(this.ts_begin)
    const t2 = this.ts_end ? dateFromISO(this.ts_end) : 0

    if (this.status) {
      return this.statuses.find(x => x.code === this.status)
    }

    return now < t1
      ? this.statuses[4]
      : t2 && t2 < now
        ? this.statuses[2]
        : this.statuses[3]
  }
}

export default Visit
