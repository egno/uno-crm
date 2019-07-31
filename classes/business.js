import ApiObject from '~/classes/api_object'
import Api from '~/api/backend'
import { makeAlert, responseGetId } from '~/api/utils'

let store

if (process.browser) {
  window.onNuxtReady(({ $store }) => {
    store = $store
  })
}

class Address extends ApiObject {
  set jsonObject (newVal) {
    if (typeof newVal === 'string') {
      this.name = newVal
      return
    }
    this.name = newVal && newVal.name
    this.point = newVal && newVal.point
    this.city = newVal && newVal.city
    this.cityAddress = newVal && newVal.cityAddress
    this.addressComponents = newVal && newVal.addressComponents
  }

  get jsonObject () {
    return super.jsonObject
  }
}

class Business extends ApiObject {
  // Main object

  /**
   * @param {{ id: String; access: Boolean; parent: String; j: Object; }} newVal
   */
  set jsonObject (newVal) {
    this.id = (newVal && newVal.id) || null
    this.access = (newVal && newVal.access) || true
    this.parent = (newVal && newVal.parent) || null
    this.type = (newVal && newVal.type) || null
    this.j = (newVal && newVal.j) || {}

    this.address = new Address(newVal && newVal.j && newVal.j.address)
    // eslint-disable-next-line no-mixed-operators
    this.name = newVal && newVal.name || this.j.name
  }

  get jsonObject () {
    return super.jsonObject
  }

  // Properties

  // objects

  set address (newVal) {
    this.j.address = new Address(newVal)
  }

  get address () {
    return this.j && this.j.address
  }

  set links (newVal) {
    if (newVal) {
      this.j.links = newVal
    } else {
      delete this.j.links
    }
  }

  get links () {
    return this.j && this.j.links
  }

  set manager (newVal) {
    if (newVal) {
      this.j.manager = newVal
    } else {
      delete this.j.manager
    }
  }

  get manager () {
    return this.j && this.j.manager
  }

  set phones (newVal) {
    if (newVal) {
      this.j.phones = newVal
    } else {
      delete this.j.phones
    }
  }

  get phones () {
    return this.j && this.j.phones
  }

  set schedule (newVal) {
    if (newVal) {
      this.j.schedule = newVal
    } else {
      delete this.j.schedule
    }
  }

  get schedule () {
    return this.j && this.j.schedule
  }

  // other

  set avatar (newVal) {
    if (newVal) {
      this.j.avatar = newVal
    } else {
      delete this.j.avatar
    }
  }

  get avatar () {
    return this.j && this.j.avatar
  }

  set category (newVal) {
    if (newVal) {
      this.j.category = newVal
    } else {
      delete this.j.category
    }
  }

  get category () {
    return this.j && this.j.category
  }

  set inn (newVal) {
    if (newVal) {
      this.j.inn = newVal
    } else {
      delete this.j.inn
    }
  }

  get inn () {
    return this.j && this.j.inn
  }

  set name (newVal) {
    if (newVal) {
      this.j.name = newVal.slice(0, 50)
    } else {
      delete this.j.name
    }
  }

  get name () {
    return this.j && this.j.name
  }

  set office (newVal) {
    if (newVal) {
      this.j.office = newVal
    } else {
      delete this.j.office
    }
  }

  get office () {
    return this.j && this.j.office
  }

  set rating (newVal) {
    if (newVal) {
      this.j.rating = newVal
    } else {
      delete this.j.rating
    }
  }

  get rating () {
    return this.j && this.j.rating
  }

  // counters

  set clients (newVal) {
    if (newVal) {
      this.j.clients = newVal
    } else {
      delete this.j.clients
    }
  }

  get clients () {
    return this.j && this.j.clients
  }

  set employees (newVal) {
    if (newVal) {
      this.j.employees = newVal
    } else {
      delete this.j.employees
    }
  }

  get employees () {
    return this.j && this.j.employees
  }

  set filials (newVal) {
    if (newVal) {
      this.j.filials = newVal
    } else {
      delete this.j.filials
    }
  }

  get filials () {
    return this.j && this.j.filials
  }

  set gallery (newVal) {
    if (newVal) {
      this.j.gallery = newVal
    } else {
      delete this.j.gallery
    }
  }

  get gallery () {
    return this.j && this.j.gallery
  }

  // API methods

  load (id) {
    if (!id || id === 'new') { return }
    return Api()
      .get(`business?id=eq.${id}`)
      .then(res => res.data[0])
      .then((res) => {
        this.jsonObject = res
      })
  }

  save () {
    if (!this.id) {
      return Api()
        .post(`business?`, this.jsonObject)
        .then(res => responseGetId(res))
        .catch((err) => {
          store.dispatch('alerts/alert', makeAlert(err))
          return false
        })
    } else {
      return Api()
        .patch(`business?id=eq.${this.id}`, this.jsonObject)
        .catch((err) => {
          store.dispatch('alerts/alert', makeAlert(err))
          return false
        })
    }
  }
}

export default Business
