const state = () => ({
  alerts: [],
  alertMaxCount: 1,
})

const getters = {
  alerts: state => state.alerts,
}

const mutations = {
  ADD_ALERT (state, payload) {
    if (!payload) {
      return
    }
    state.alerts.push(payload)
    if (state.alerts.length > state.alertMaxCount) {
      state.alerts.shift()
    }
  },
  DEL_ALERT (state, payload) {
    if (!payload) {
      state.alerts = []
    }
  },
}

const actions = {
  alert ({ commit }, payload) {
    commit('ADD_ALERT', payload)
  },
  delAlert ({ commit }, payload) {
    commit('DEL_ALERT', payload)
  },
}

export default {
  state,
  getters,
  actions,
  mutations,
}
