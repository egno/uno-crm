//import Vue from 'vue'
//import axios from 'axios'
// import VueAxios from 'vue-axios'
//import VueCacheData from 'vue-cache-data'
import Api from '~/api/backend'
import { formatDate, getISOTimeZoneOffset } from '~/components/calendar/utils'
import { makeAlert } from '~/api/utils'

// Vue.use(VueAxios, axios, VueCacheData)

// TODO вытащить localStorage в отдельный модуль

export const state = () => ({
  actions: [],
  actualDate: '',
  apiTime: '',
  appTitle: '',

  calendar: [],
  calendarMonth: [],
  defaultAppTitle: 'UNO',

  messageWindow: false,
  profileDrawer: false,
  navBarVisible: true,

  schedule: [],
  searchString: '',
  selectedBreak: undefined,
  selectedVisit: undefined,
  token: ''
})

export const getters = {
  actions: state => state.actions,
  actualDate: state => state.actualDate,
  calendarMonth: state => state.calendarMonth,
  apiTime: state => state.apiTime,
  apiTimeZone: state => {
    if (!state.apiTime) {
      return
    }
    return getISOTimeZoneOffset(state.apiTime)
  },
  appTitle: state => state.appTitle || state.defaultAppTitle,
  calendar: state => state.calendar,
  defaultAppTitle: state => state.defaultAppTitle,

  messageWindow: state => state.messageWindow,
  profileDrawer: state => state.profileDrawer,
  navBarVisible: state => state.navBarVisible,
  schedule: state => state.schedule,
  searchString: state => state.searchString,
  selectedBreak: state => state.selectedBreak,
  selectedVisit: state => state.selectedVisit,
  token: state => {
    return state.token
    // window.localStorage.accessToken;
  }
}

export const mutations = {
  LOAD_CALENDAR (state, payload) {
    state.calendar = payload
  },
  LOAD_SCHEDULE (state, payload) {
    state.schedule = payload
  },
  MESSAGE_WINDOW (state, payload) {
    if (payload) {
      const elem = document.getElementById("amoforms_overlay")
      elem.style.display='block'
      elem.style.zIndex='999'

      if (!state.helpListener) {
        state.helpListener = true
        elem.addEventListener("click", function () {
          const elem = document.getElementById("amoforms_overlay")
          elem.style.display = 'none'
        }, {capture: true})
      }
    }
  },
  PROFILE_DRAWER (state, payload) {
    state.profileDrawer = !!payload
  },
  NAVBAR (state, payload) {
    var status = payload == undefined ? !state.navBarVisible : payload
    state.navBarVisible = status
  },
  SELECT_BREAK (state, payload) {
    state.selectedBreak = payload
  },
  SELECT_VISIT (state, payload) {
    state.selectedVisit = payload
  },
  SET_ACTIONS (state, payload) {
    state.actions = payload || []
  },
  SET_ACTUAL_DATE (state, payload) {
    state.actualDate = payload
  },
  SET_CALENDAR_MONTH (state, payload) {
    state.calendarMonth = payload
  },
  SET_API_TIME (state, payload) {
    state.apiTime = payload
  },
  SET_APP_TITLE (state, payload) {
    state.appTitle = payload
  },
  SET_SEARCH_STRING (state, payload) {
    state.searchString = payload
  },
  SET_TOKEN (state, payload) {
    state.token = payload
    if (payload) {
      localStorage.setItem('accessToken', payload)
    } else {
      localStorage.removeItem('accessToken')
    }
  },
  SHOW_NAVBAR (state) {
    state.navBarVisible = true
  }
}

export const actions = {
  closeMessageWindow ({ commit, dispatch }, payload) {
    if (payload) {
      dispatch('sendMessage', payload)
    }
    commit('MESSAGE_WINDOW', false)
  },
  closeProfileDrawer ({ commit }) {
    commit('PROFILE_DRAWER', false)
  },
  selectBreak ({ commit }, payload) {
    commit('SELECT_BREAK', payload)
  },
  selectVisit ({ commit }, payload) {
    commit('SELECT_VISIT', payload)
  },
  sendMessage ({ commit }, payload) {
    if (!payload) return
    const path = 'rpc/send_message'
    Api()
      .post(path, payload)
      .then(res => res.data)
      .then(res => {
        if (res.status === 'sended') {
          commit('ADD_ALERT', {
            message:
              'Мы уже решаем эту проблему! При необходимости мы свяжемся с вами'
          })
        } else {
          commit('ADD_ALERT', res)
        }
      })
      .catch(err => commit('ADD_ALERT', makeAlert(err)))
  },
  setActions ({ commit }, payload) {
    commit('SET_ACTIONS', payload)
  },
  setActualDate ({ commit, dispatch, getters, state }, payload) {
    if (payload instanceof Date) {
      payload = formatDate(payload)
    }
    if (!payload) {
      const dt = new Date()
      payload = formatDate(dt)
    }

    /* if another year or month */
    if (
      state.actualDate.slice(0, 7) !== payload.slice(0, 7) ||
      Object.keys(state.calendar).length === 0
    ) {
      const from = `${payload.slice(0, 7)}-01`
      let d1 = new Date()
      d1.setDate(1)
      d1.setYear(payload.slice(0, 4))
      d1.setMonth(payload.slice(5, 7))
      if (getters.businessId) {
        dispatch('loadCalendar', {
          business: getters.businessId,
          dates: [from, formatDate(d1)]
        })
      } else {
        state.calendar = []
      }
    }
    commit('SET_ACTUAL_DATE', payload)
  },
  setAppTitle ({ commit }, payload) {
    commit('SET_APP_TITLE', payload)
  },
  setSearchString ({ commit }, payload) {
    commit('SET_SEARCH_STRING', payload)
  },
  loadApiTime ({ commit }) {
    Api()
      .get('info')
      .then(res => res.data[0])
      .then(res => {
        commit('SET_API_TIME', res.current_timestamp)
      })
      .catch(err => commit('ADD_ALERT', makeAlert(err)))
  },
  loadCalendar ({ commit }, payload) {
    if (!payload.business) {
      return
    }
    const path = `business_calendar?select=dt,j,employee&and=(business_id.eq.${
      payload.business
    },dt.gte.${payload.dates[0]},dt.lte.${payload.dates[1]})`
    Api()
      .get(path)
      .then(res => res.data)
      .then(res => {
        commit('LOAD_SCHEDULE', res)
      })
      .catch(err => commit('ADD_ALERT', makeAlert(err)))
    const c_path = `calendar?and=(dt.gte.${payload.dates[0]},dt.lte.${
      payload.dates[1]
    })`
    Api()
      .get(c_path)
      .then(res => res.data)
      .then(res => {
        commit('LOAD_CALENDAR', res)
      })
      .catch(err => commit('ADD_ALERT', makeAlert(err)))
  },

  loadFromStorage ({ commit, dispatch }) {
    commit('SET_TOKEN', localStorage.getItem('accessToken'))
    dispatch('user/loadUserInfo')
  },
  navBar ({ commit }, payload) {
    commit('NAVBAR', payload)
  },
  openMessageWindow ({ commit }) {
    commit('MESSAGE_WINDOW', true)
  },
  openProfileDrawer ({ commit }) {
    commit('PROFILE_DRAWER', true)
  },
  refreshToken ({ commit, getters }) {
    const path = 'rpc/token'
    if (!getters.token) {
      return
    }
    Api()
      .post(path)
      .then(res => res.data)
      .then(res => res[0])
      .then(res => res.token)
      .then(token => {
        commit('SET_TOKEN', token)
      })
      .catch(err => {
        commit('ADD_ALERT', makeAlert(err))
        commit('SET_TOKEN', undefined)
      })
  },
  register ({ commit, dispatch }, payload) {
    const registerPath = 'rpc/register'
    
    return Api()
      .post(registerPath, payload)
      .then(res => {
        return res.data
      })
      .then(res => res[0])
      .then(res => res.token)
      .then(token => {
        commit('SET_TOKEN', token)
        dispatch('user/loadUserInfo')
      })
      .catch(err => {
        console.log('err', err)
        commit('ADD_ALERT', makeAlert(err))
      })
  }
}

