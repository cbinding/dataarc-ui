import router from '@/router/index'
import userService from '@/api/user.service'
import Cookie from 'js-cookie'

const rawUser = Cookie.get('user')
const user = rawUser ? JSON.parse(Cookie.get('user')) : null

const state = {
  status: {
    loggedIn: !!user,
  },
  user: user || null,
  role: user ? user.role : null,
}

if (user) {
  state.status.loggedIn = true
  state.user = user
}

const actions = {
  login({ dispatch, commit }, { identifier, password }) {
    commit('loginRequest', { identifier })
    userService.login(identifier, password)
    .then(
      (user) => {
        commit('loginSuccess', user)
        router.push('/')
      },
      (error) => {
        commit('loginFailure', error)
        dispatch('alert/error', error, { root: true })
      },
    )
  },
  logout({ commit }) {
    userService.logout()
    commit('logout')
  },
  register({ dispatch, commit }, user) {
    commit('registerRequest', user)

    userService.register(user)
    .then(
      (user) => {
        commit('registerSuccess', user)
        router.push('/login')
        setTimeout(() => {
          // display success message after route change completes
          dispatch('alert/success', 'Registration successful', { root: true })
        })
      },
      (error) => {
        commit('registerFailure', error)
        dispatch('alert/error', error, { root: true })
      },
    )
  },
}

const mutations = {
  loginRequest(state, user) {
    state.status = { loggingIn: true }
    state.user = user
    state.role = user ? user.role : null
  },
  loginSuccess(state, user) {
    state.status = { loggedIn: true }
    state.user = user
    state.role = user ? user.role : null
  },
  loginFailure(state) {
    state.status = {}
    state.user = null
    state.role = null
  },
  logout(state) {
    state.status = {}
    state.user = null
    state.role = null
  },
  registerRequest(state, user) {
    state.status = { registering: true }
  },
  registerSuccess(state, user) {
    state.status = {}
  },
  registerFailure(state, error) {
    state.status = {}
  },
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
}
