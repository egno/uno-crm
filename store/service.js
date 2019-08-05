import Api from '~/api/backend'
import { makeAlert } from '~/api/utils'

const state = () => ({
  serviceGroups: [],
  serviceList: []
})

const getters = {
  serviceGroups: state => state.serviceGroups
}

const mutations = {
  SET_SERVICE_GROUPS (state, payload) {
    state.serviceGroups = payload
  },
  LOAD_SERVICE_LIST (state, payload) {
    state.serviceList = payload
  }
}

const actions = {
  loadServiceGroups ({ commit }) {
    const path = 'service_groups?name=not.is.null'
    Api({noToken: true})
      .get(path)
      .then(res => res.data)
      .then((res) => {
        commit('SET_SERVICE_GROUPS', res)
      })
      .catch(err => commit('alerts/ADD_ALERT', makeAlert(err), { root: true }))
  },
  loadServiceList ({ commit }) {
    const path = 'service'
    Api()
      .get(path)
      .then(res => res.data)
      .then((res) => {
        commit('LOAD_SERVICE_LIST', res)
      })
      .catch(err => commit('alerts/ADD_ALERT', makeAlert(err), { root: true }))
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
