import Api from '~/api/backend'
import { makeAlert } from '~/api/utils'

const state = () => ({
  employees: [],
  employeeCategories: [],
  employeePositions: []
})

const getters = {
  employees: state => state.employees,
  employeeCount: state => state.employees.length,
  employeeCategories: state => state.employeeCategories,
  employeePositions: state => state.employeePositions,
  // allEmployeesServices: state =>
  //   state.employees &&
  //   state.employees
  //     .map(x => x.j && x.j.services.map(s => ({ employee: x.id, service: s })))
  //     .flat()
}

const mutations = {
  ADD_CATEGORIE (state, payload) {
    if (!payload) return
    if (state.employeeCategories.some(x => x.name === payload)) return
    state.employeeCategories.unshift({ name: payload })
  },
  ADD_POSITION (state, payload) {
    if (!payload) return
    if (state.employeePositions.some(x => x.name === payload)) return
    state.employeePositions.unshift({ name: payload })
  },
  LOAD_EMPLOYEES (state, payload) {
    state.employees = payload || []
  },
  DELETE_EMPLOYEE_ITEM (state, payload) {
    if (!payload) return
    let idx = state.employees.findIndex(x => x.id === payload)
    if (idx !== -1) {
      state.employees.splice(idx, 1)
    }
  },
  SET_CATEGORIES (state, payload) {
    state.employeeCategories = payload
  },
  SET_EMPLOYEE_ITEM (state, payload) {
    if (!(payload && payload.id)) return
    let idx = state.employees.findIndex(x => x.id === payload.id)
    if (idx !== -1) {
      state.employees.splice(idx, 1, payload)
    } else {
      state.employees.push(payload)
    }
  },
  SET_POSITIONS (state, payload) {
    state.employeePositions = payload
  }
}

const actions = {
  addCategorie ({ commit }, payload) {
    commit('ADD_CATEGORIE', payload)
  },
  addPosition ({ commit }, payload) {
    commit('ADD_POSITION', payload)
  },
  deleteEmployee ({ commit }, payload) {
    if (!payload) return
    Api()
      .delete(`employee?id=eq.${payload}`)
      .then(() => {
        commit('DELETE_EMPLOYEE_ITEM', payload)
      })
      .catch(err => {
        this.alert(makeAlert(err))
      })
  },
  loadEmployee ({ commit }, businessId) {
    commit('LOAD_EMPLOYEES', null)
    if (!businessId) {
      return
    }
    const path = `employee?parent=eq.${businessId}`
    Api()
      .get(path)
      .then(res => res.data)
      .then(res => {
        commit('LOAD_EMPLOYEES', res)
      })
      .catch(err => commit('ADD_ALERT', makeAlert(err)))
  },
  loadEmployeeCategories ({ commit }) {
    const path = 'employee_categories?name=not.is.null'
    Api()
      .get(path)
      .then(res => res.data)
      .then(res => {
        commit('SET_CATEGORIES', res.map(x => x.name))
      })
      .catch(err => commit('ADD_ALERT', makeAlert(err)))
  },
  loadEmployeePositions ({ commit }) {
    const path = 'employee_positions?name=not.is.null'
    Api()
      .get(path)
      .then(res => res.data)
      .then(res => {
        commit('SET_POSITIONS', res.map(x => x.name))
      })
      .catch(err => commit('ADD_ALERT', makeAlert(err)))
  },
  setEmployeeItem ({ commit }, payload) {
    commit('SET_EMPLOYEE_ITEM', payload)
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
