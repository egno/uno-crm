/* eslint-disable camelcase */
/* eslint-disable no-mixed-operators */
import ApiObject from '~/classes/api_object'
import Api from '~/api/backend'
import { makeAlert, responseGetId } from '~/api/utils'
import Name from '~/classes/name'
import Visit from '~/classes/visit'

let store

if (process.browser) {
  window.onNuxtReady(({ $store }) => {
    store = $store
  })
}

// todo remove store, add dispatching 'alerts/alert' in Vue intsances

class Client extends ApiObject {
  // Main object

  /**
   * @param {{ id: String; access: Boolean; parent: String; j: Object; }} newVal
   */
  set jsonObject (newVal) {
    this.id = (newVal && newVal.id) || null
    this.business_id = (newVal && newVal.business_id) || null
    this.user_id = (newVal && newVal.user_id) || null
    this.j = (newVal && newVal.j) || {}
    this.visit = (newVal && newVal.visit) || {}

    // set calculated properties
    this.birth_date = newVal && newVal.j && newVal.j.birth_date
    this.discount = newVal && newVal.j && newVal.j.discount
    this.name = newVal && newVal.j && newVal.j.name || ''
    this.email = newVal && newVal.j && newVal.j.email
    this.phone = newVal && newVal.j && newVal.j.phone
    this.phones = newVal && newVal.j && newVal.j.phones || ['']
    this.sex = newVal && newVal.j && newVal.j.sex
    this.notes = newVal && newVal.j && newVal.j.notes
    this.message_agreement = newVal && newVal.j && newVal.j.message_agreement
    this.lastVisit = newVal && newVal.visit && newVal.visit.last
  }

  get jsonObject () {
    return super.jsonObject
  }

  get sexList () {
    return [
      { code: 'M', display: 'Муж' },
      { code: 'F', display: 'Жен' },
      { code: 'C', display: 'Дети' }
    ]
  }

  // Properties

  /**
   * @param {String} newVal
   */
  set birth_date (newVal) {
    if (newVal) {
      this.j = { ...this.j, ...{ birth_date: newVal } }
    } else {
      delete this.j.birth_date
    }
  }

  get birth_date () {
    return this.j && this.j.birth_date
  }

  /**
   * @param {String} newVal
   */
  set discount (newVal) {
    if (newVal) {
      this.j = { ...this.j, ...{ discount: newVal } }
    } else {
      delete this.j.discount
    }
  }

  get discount () {
    return this.j && this.j.discount
  }

  /**
   * @param {String} newVal
   */
  set email (newVal) {
    if (newVal) {
      this.j = { ...this.j, ...{ email: newVal } }
    } else {
      delete this.j.email
    }
  }

  get email () {
    return this.j && this.j.email
  }

  /**
   * @param {String} newVal
   */
  set phone (newVal) {
    if (newVal) {
      this.j = { ...this.j, ...{ phone: newVal } }
    } else {
      delete this.j.phone
    }
  }

  get phone () {
    return this.j && this.j.phone
  }

  /**
   * @param {any} newVal
   */
  set fullName (newVal) {
    this.name = newVal
  }

  get fullName () {
    return this.name.fullName
  }
  /**
   * @param {any} newVal
   */
  set name (newVal) {
    if (this.j.name instanceof Name) {
      this.name.fullName = newVal
      return
    }
    this.j.name = new Name(newVal)
  }

  get name () {
    return this.j.name
  }

  /**
   * @param {String} newVal
   */
  set phones (newVal) {
    this.j.phones = newVal || ['']
  }

  get phones () {
    return this.j && this.j.phones
  }

  /**
   * @param {any} newVal
   */
  set lastVisit (newVal) {
    if (!newVal) { return }
    this._lastVisit = new Visit(newVal)
  }

  get lastVisit () {
    return this._lastVisit
  }

  /**
   * @param {any} newVal
   */
  set sex (newVal) {
    let val = newVal
    if (newVal || newVal === 0) {
      if (typeof newVal === 'number') {
        val = this.sexList[newVal].code
      }
      this.j = { ...this.j, ...{ sex: val } }
    } else {
      delete this.j.sex
    }
  }

  get sex () {
    return this.j && this.sexList.findIndex(x => x.code === this.j.sex)
  }

  /**
   * @param {String} newVal
   */
  set notes (newVal) {
    if (newVal) {
      this.j = { ...this.j, ...{ notes: newVal } }
    } else {
      delete this.j.notes
    }
  }

  get notes () {
    return this.j && this.j.notes
  }

  // API methods

  load (id) {
    if (!id || id === 'new') { return Promise.resolve() }
    return Api()
      .get(`client?id=eq.${id}`)
      .then(res => res.data[0])
      .then((res) => {
        this.jsonObject = res
      })
  }

  save () {
    if (!this.business_id) { return }
    if (!this.id || this.id === 'new') {
      this.id = null
      return Api()
        .post(`client?`, this.jsonObject)
        .then(res => responseGetId(res))
        .catch((err) => {
          store && store.dispatch('alerts/alert', makeAlert(err))
          return false
        })
    } else {
      return Api()
        .patch(`client?id=eq.${this.id}`, this.jsonObject)
        .catch((err) => {
          store && store.dispatch('alerts/alert', makeAlert(err))
          return false
        })
    }
  }
}

export default Client
