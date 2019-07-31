import Api from '~/api/backend'
import { makeAlert } from '~/api/utils'

/* todo update
    Роли:
admin, manager - это сотрудники Uno.
business - бизнес: салон\частный мастер.
client - клиент салона.
anon - незарегистрированный.
Могут быть еще разные роли внутри business
*/
export const state = () => ({
  userInfo: {},
  userLoadingState: 'not started' /* also: 'started', 'finished' */,
  myBusinessList: []
})

export const getters = {
  userLoadingState: state => state.userLoadingState,
  loggedIn: (state, getters) => {
    return !!getters.userID
  },
  userAvatar: (state) => {
    return (
      state.userInfo &&
      state.userInfo.data &&
      state.userInfo.data.j &&
      state.userInfo.data.j.avatar
    )
  },
  userID: (state, getters) => {
    const info = getters.userInfo
    if (info) {
      return info.login
    }
  },
  userInfo: (state) => {
    return state.userInfo
  },
  userLogin: (state, getters) => {
    const info = getters.userInfo
    if (info) {
      return info.login
    }
  },
  userRole: (state, getters) => {
    const info = getters.userInfo
    if (info) {
      return info.role
    }
  },
  userEmail: (state, getters) => {
    const info = getters.userInfo
    return info && info.data && info.data.email
  },
  userPhone: (state, getters) => {
    const info = getters.userInfo
    return info && info.data && info.data.phone
  },
  isPersonalMaster: (state, getters) => {
    const info = getters.userInfo
    const business = getters.businessInfo
    return (
      (info &&
        info.data &&
        info.data.j &&
        info.data.j.business_category === 'Частный мастер') ||
      (business && business.type === 'P')
    )
  },
  myBusinessList: state => state.myBusinessList
}

export const mutations = {
  SET_USERINFO (state, payload) {
    state.userInfo = payload
    if (payload) {
      localStorage.setItem('userInfo', JSON.stringify(payload))
    } else {
      localStorage.removeItem('userInfo')
    }
  },
  SET_LOADING (state, payload) {
    state.userLoadingState = payload
  },
  SET_MY_BUSINESS_LIST (state, payload) {
    state.myBusinessList = payload
  }
}

export const actions = {
  loadUserInfo ({ commit, state }) {
    const infoPath = 'rpc/me'

    if (state.userLoadingState === 'started') {
      return
    }
    commit('SET_LOADING', 'started')
    Api()
      .post(infoPath)
      .then(res => res.data)
      .then((res) => {
        commit('SET_USERINFO', res)
        commit('SET_LOADING', 'finished')
      })
      .catch((err) => {
        commit('alerts/ADD_ALERT', makeAlert(err), { root: true })
        commit('SET_LOADING', 'not started')
      })
  },
  loadMyBusinessList ({ commit, getters }) {
    if (!getters.loggedIn) {
      return []
    }

    return Api()
      .get(`my_business?limit=10`)
      .then(({ data }) => {
        commit('SET_MY_BUSINESS_LIST', data)
        return data
      })
  },
  login ({ commit, dispatch }, payload) {
    const loginPath = 'rpc/login'

    commit('common/SET_TOKEN', '', { root: true })
    return Api()
      .post(loginPath, payload)
      .then(res => res.data)
      .then(res => res[0])
      .then(res => res.token)
      .then((token) => {
        commit('common/SET_TOKEN', token, { root: true })
        dispatch('loadUserInfo')
        dispatch('loadMyBusinessList')
      })
      .catch((err) => {
        commit('alerts/ADD_ALERT', makeAlert(err), { root: true })
      })
  },
  logout ({ commit }) {
    commit('common/SET_TOKEN', '', { root: true })
    commit('SET_USERINFO', {})
    commit('business/SET_BUSINESS_INFO', {}, { root: true })
    commit('SET_LOADING', 'not started')
  },
  setUserAvatar ({ dispatch, state }, payload) {
    if (!payload) { return }
    if (!state.userInfo) { return }
    const j = state.userInfo.data.j
    j.avatar = payload
    dispatch('uploadUserInfo', j)
  },
  uploadUserInfo ({ commit }, payload) {
    const path = 'rpc/set_user_info'
    Api()
      .post(path, { j: payload })
      .then((res) => {
        commit('SET_USERINFO', res.data)
        commit('SET_LOADING', 'finished')
      })
  }
}
