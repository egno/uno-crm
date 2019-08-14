import ApiObject from '~/classes/api_object'
import Api from '~/api/backend'
import { makeAlert, responseGetId } from '~/api/utils'

let store

if (process.browser) {
  window.onNuxtReady(({ $store }) => {
    store = $store
  })
}
/* Example

settings = {
  notifications: {
    events: {
      promotion: { enabled: false },
      time_visit: { enabled: false },
      cancel_visit: { phone: '799999998', enabled: false },
      account_state: { enabled: false },
      confirm_phone: { enabled: false },
      new_visit_client: { enabled: false },
      new_visit_manager: { phone: '79658239468', enabled: false }
    },
    provider: {
      key: 'bo7PrOZBvFwgeNDmOBcUjrJfDNYEDTgkMt62j4AdF7Utbt6tig7xecfVo7Kn',
      name: 'SMS gorod'
    }
  }
}; */

class Event extends ApiObject {
  set jsonObject (newVal) {
    this._title = newVal && newVal.title
    this.enabled = (newVal && newVal.enabled) || false
    if (newVal && newVal.description) {
      this.description = newVal.description
    }
    if (newVal && (newVal.phone || newVal.phone === null)) {
      this.phone = newVal && newVal.phone
    }
    if (newVal && (newVal.amount || newVal.amount === null)) {
      this.amount = newVal && newVal.amount
    }
    if (newVal && (newVal.template || newVal.template === null)) {
      this.template = newVal && newVal.template
    }
  }
  get jsonObject () {
    const res = super.jsonObject
    if (this._phone) {
      res.phone = this._phone
    }
    if (this._amount) {
      res.amount = this._amount
    }
    return res
  }

  set title (newVal) {
    this._title = newVal
  }
  get title () {
    return this._title
  }

  set phone (newVal) {
    this._phone = newVal || null
  }
  get phone () {
    return this._phone
  }

  set amount (newVal) {
    this._amount = newVal || null
  }
  get amount () {
    return this._amount
  }
}

class Events extends ApiObject {
  set jsonObject (newVal) {
    this.balance_level = new Event({
      ...{ title: 'SMS-уведомление по остатку на счете', amount: null, phone: null },
      ...(newVal && newVal.balance_level),
    })
    this.new_visit_client = new Event({
      ...{
        title: 'Уведомлять клиента о новой онлайн-записи',
      },
      ...(newVal && newVal.new_visit_client),
    })
    this.new_visit_manager = new Event({
      ...{
        title: 'Уведомлять менеджера филиала о новой онлайн-записи',
        phone: null,
      },
      ...(newVal && newVal.new_visit_manager),
    })
    this.cancel_visit = new Event({
      ...{ title: 'Уведомлять сотрудника об отмене онлайн-записи', phone: null },
      ...(newVal && newVal.cancel_visit),
    })
    this.time_visit = new Event({
      ...{ title: 'Напоминать клиенту о предстоящем визите' },
      ...(newVal && newVal.time_visit),
    })
  }
  get jsonObject () {
    return super.jsonObject
  }
}

class Provider extends ApiObject {
  set jsonObject (newVal) {
    this.key = newVal && newVal.key
    this.name = newVal && newVal.name
    this.login = newVal && newVal.login
    this.password = newVal && newVal.password
  }
  get jsonObject () {
    return super.jsonObject
  }
}

class Notifications extends ApiObject {
  set jsonObject (newVal) {
    this.events = new Events(newVal && newVal.events)
    this.provider = new Provider(newVal && newVal.provider)
  }
  get jsonObject () {
    return super.jsonObject
  }
}

class Settings extends ApiObject {
  set jsonObject (newVal) {
    this.notifications = new Notifications(newVal && newVal.notifications)
  }
  get jsonObject () {
    return super.jsonObject
  }
}

class BusinessSettings extends ApiObject {
  // Main object

  /**
   * @param {{ id: String; access: Boolean; parent: String; j: Object; }} newVal
   */
  set jsonObject (newVal) {
    this.id = (newVal && newVal.id) || null
    this.settings = new Settings(newVal && newVal.settings)
  }

  get jsonObject () {
    return super.jsonObject
  }

  // Properties
  set notifications (newVal) {
    this.settings.notifications = newVal
  }

  get notifications () {
    return this.settings.notifications
  }

  // API methods

  load (id) {
    if (!id || id === 'new') { return }
    return Api()
      .get(`business_settings?id=eq.${id}`)
      .then(res => res.data[0])
      .then((res) => {
        this.jsonObject = res
      })
  }

  save () {
    if (!this.id) {
      return Api()
        .post(`business_settings?`, this.jsonObject)
        .then(res => responseGetId(res))
        .catch((err) => {
          store.dispatch('alerts/alert', makeAlert(err))
          return false
        })
    } else {
      return Api()
        .patch(`business_settings?id=eq.${this.id}`, this.jsonObject)
        .then(() => {
          store.dispatch('alerts/alert', makeAlert('Сохранено успешно'))
        })
        .catch((err) => {
          store.dispatch('alerts/alert', makeAlert(err))
          return false
        })
    }
  }
}

export default BusinessSettings
