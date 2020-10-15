import router from '@/router/index'
import userService from '@/api/user.service'
import Cookies from 'js-cookie'

const rawUser = Cookies.get('user')
const user = rawUser ? JSON.parse(Cookies.get('user')) : null

const state = {
  status: {
    loggedIn: !!user,
  },
  user: user || null,
  role: user ? user.role : null,
}


const actions = {
  login({ dispatch, commit }, { identifier, password }) {
    commit('loginRequest', { identifier })
    return userService.login(identifier, password)
    .then(
      (response) => {
        commit('loginSuccess', response)
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
        router.push('/notice')
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
  addNewUser({ dispatch, commit }, user) {
    commit('addNewUserRequest', user)

    userService.register(user)
    .then(
      (user) => {
        commit('addNewUserSuccess', user)
        router.push('/admin/users')
        setTimeout(() => {
          // display success message after route change completes
          dispatch('alert/success', 'New User Added', { root: true })
        })
      },
      (error) => {
        commit('addNewUserFailure', error)
        dispatch('alert/error', error)
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
  loginSuccess(state, response) {
    state.status = { loggedIn: true }
    state.user = response.user
    state.jwt = response.jwt
    state.role = state.user ? state.user.role : null
  },
  loginFailure(state, err) {
    if (err.message === 'Request failed with status code 400') {
      err.message = "That username or password combination doesn't exist"
    }
    state.status = { loggedIn: false, error: err }
    state.user = null
    state.role = null
    state.jwt = null
  },
  logout(state) {
    state.status = {}
    state.user = null
    state.jwt = null
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
  addNewUserRequest(state, user) {
    state.status = { registering: true }
  },
  addNewUserSuccess(state, user) {
    state.status = {}
  },
  addNewUserFailure(state, error) {
    state.status = {}
  },
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
}
