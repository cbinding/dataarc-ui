import Vue from 'vue';
import Vuex from 'vuex';
import router from './router';

import { defaultClient as apolloClient } from './main';

import { GET_CURRENT_USER, LOGIN_USER, CREATE_USER } from './queries';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: null,
    loading: false,
    error: null,
    authError: null
  },
  mutations: {
    setUser: (state, payload) => {
      state.user = payload;
    },
    setLoading: (state, payload) => {
      state.loading = payload;
    },
    setError: (state, payload) => {
      state.error = payload;
    },
    setAuthError: (state, payload) => {
      state.authError = payload;
    },
    clearUser: state => (state.user = null),
    clearError: state => (state.error = null)
  },
  actions: {
    getCurrentUser: ({ commit }) => {
      commit('setLoading', true);
      apolloClient
        .query({
          query: GET_CURRENT_USER
        })
        .then(({ data }) => {
          commit('setLoading', false);
          // Add user data to state
          commit('setUser', data.user);
          console.log(data);
        })
        .catch(err => {
          commit('setLoading', false);
          console.log('NOT LOGGED IN');
          console.error(err);
        });
    },
    loginUser: ({ commit }, payload) => {
      commit('clearError');
      commit('setLoading', true);
      apolloClient
        .mutate({
          mutation: LOGIN_USER,
          variables: payload
        })
        .then(({ data }) => {
          commit('setLoading', false);
          localStorage.setItem('token', data.login.jwt);
          // to make sure created method is run in main.js (we run getCurrentUser), reload the page
          console.log('Login successful', data.login.jwt);
          router.go();
        })
        .catch(err => {
          commit('setLoading', false);
          commit('setError', err);
          console.log('Login failed');
          console.error(err);
        });
    },
    createUser: ({ commit }, payload) => {
      commit('clearError');
      commit('setLoading', true);
      apolloClient
        .mutate({
          mutation: CREATE_USER,
          variables: payload
        })
        .then(({ data }) => {
          commit('setLoading', false);
          console.log(data);
          localStorage.setItem('token', data.login.jwt);
          // to make sure created method is run in main.js (we run getCurrentUser), reload the page
          router.go();
        })
        .catch(err => {
          commit('setLoading', false);
          commit('setError', err);
          console.error(err);
        });
    },
    logoutUser: async ({ commit }) => {
      // clear user in state
      commit('clearUser');
      // remove token in localStorage
      localStorage.setItem('token', '');
      // end session
      await apolloClient.resetStore();
      // redirect home - kick users out of private pages (i.e. profile)
      router.push('/');
    }
  },
  getters: {
    user: state => state.user,
    userFavorites: state => state.user && state.user.favorites,
    loading: state => state.loading,
    error: state => state.error,
    authError: state => state.authError
  }
});
