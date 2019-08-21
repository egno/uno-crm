import Api from '~/api/backend'
import { makeAlert } from '~/api/utils'

const state = () => ({
  employees: [],
  employeeCategories: [],
  employeePositions: [],
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
  LOAD_EMPLOYEES (state, payload) {
    state.employees = payload || []
  },
  DELETE_EMPLOYEE_ITEM (state, payload) {
    if (!payload) { return }
    const idx = state.employees.findIndex(x => x.id === payload)
    if (idx !== -1) {
      state.employees.splice(idx, 1)
    }
  },
  SET_CATEGORIES (state, payload) {
    state.employeeCategories = payload
  },
  ADD_EMPLOYEE_ITEM (state, payload) {
    if (!(payload && payload.id)) { return }
    const idx = state.employees.findIndex(x => x.id === payload.id)
    if (idx === -1) {
      state.employees.push(payload)
    } else {
      state.employees.splice(idx, 1, payload)
    }
  },
}

const actions = {
  deleteEmployee ({ commit }, payload) {
    if (!payload) { return }
    Api()
      .delete(`employee?id=eq.${payload}`)
      .then(() => {
        commit('DELETE_EMPLOYEE_ITEM', payload)
      })
      .catch((err) => {
        this.alert(makeAlert(err))
      })
  },
  loadEmployees ({ commit }, businessId) {
    commit('LOAD_EMPLOYEES', null)
    if (!businessId) {
      return
    }
    const path = `employee?parent=eq.${businessId}`
    Api()
      .get(path)
      .then(res => res.data)
      .then((res) => {
        commit('LOAD_EMPLOYEES', res)
      })
      .catch(err => commit('alerts/ADD_ALERT', makeAlert(err), { root: true }))
  },
  loadEmployeeCategories ({ commit }) {
    const path = 'employee_categories?name=not.is.null'
    Api()
      .get(path)
      .then(res => res.data)
      .then((res) => {
        commit('SET_CATEGORIES', res.map(x => x.name))
      })
      .catch(err => commit('alerts/ADD_ALERT', makeAlert(err), { root: true }))
  },
  addEmployeeItem ({ commit, state }, payload) {
    commit('ADD_EMPLOYEE_ITEM', payload)
  },
}

export default {
  state,
  getters,
  actions,
  mutations,
}
