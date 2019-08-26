const state = () => ({
  navigationVisible: null,
  navigationMini: null,
})

const getters = {
  navigationVisible: state => state.navigationVisible,
  navigationMini: state => state.navigationMini,
}

const mutations = {
  SET_NAVIGATION_VISIBLE (state, payload) {
    state.navigationVisible = payload
  },
  SET_NAVIGATION_MINI (state, payload) {
    state.navigationMini = payload
  },
}

const actions = {
  setNavigationMini ({ commit }, payload) {
    commit('SET_NAVIGATION_MINI', payload)
  },
  setNavigationVisible ({ commit }, payload) {
    commit('SET_NAVIGATION_VISIBLE', payload)
  },
}

export default {
  state,
  getters,
  actions,
  mutations,
}
