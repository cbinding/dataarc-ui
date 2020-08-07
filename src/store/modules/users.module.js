// Vuex users
import userService from '@/api/user.service'

const state = {
  all: {},
  user: {},
}

const actions = {
  getAll({ commit }) {
    commit('getAllRequest')

    userService.getAll()
    .then(
      (users) => commit('getAllSuccess', users),
      (error) => commit('getAllFailure', error),
    )
  },
  getById({ commit }, id) {
    commit('getByIdRequest')

    userService.getById(id)
    .then(
      (user) => commit('getByIdSuccess', user),
      (error) => commit('getByIdFailure', error),
    )
  },

  delete({ commit }, id) {
    commit('deleteRequest', id)

    userService.delete(id)
    .then(
      (user) => commit('deleteSuccess', id),
      (error) => commit('deleteFailure', { id, error: error.toString() }),
    )
  },
}

const mutations = {
  getAllRequest(state) {
    state.all = { loading: true }
  },
  getByIdRequest(state) {
    state.user = { loading: true }
  },
  getAllSuccess(state, users) {
    state.all = { items: users }
  },
  getByIdSuccess(state, user) {
    state.user = user
  },
  getAllFailure(state, error) {
    state.all = { error }
  },
  getByIdFailure(state, error) {
    state.user = { error }
  },
  deleteRequest(state, id) {
    // add 'deleting:true' property to user being deleted
    state.all.items = state.all.items.map((user) => (user.id === id
      ? { ...user, deleting: true }
      : user))
  },
  deleteSuccess(state, id) {
    // remove deleted user from state
    state.all.items = state.all.items.filter((user) => user.id !== id)
  },
  deleteFailure(state, { id, error }) {
    // remove 'deleting:true' property and add 'deleteError:[error]' property to user
    state.all.items = state.items.map((user) => {
      if (user.id === id) {
        // make copy of user without 'deleting:true' property
        const { deleting, ...userCopy } = user
        // return copy of user with 'deleteError:[error]' property
        return { ...userCopy, deleteError: error }
      }

      return user
    })
  },
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
}
