import Vue from 'vue';
import vuetify from '@/plugins/vuetify';
import App from './App.vue';
import router from './router';
import store from './store';

import ApolloClient from 'apollo-boost';
import VueApollo from 'vue-apollo';

import FormAlert from './components/shared/FormAlert';

Vue.config.productionTip = false;

// Load our different layouts
Vue.component('landing-layout', () =>
  import(/* webpackChunkName: "landing" */ './layouts/Landing.vue')
);
Vue.component('dashboard-layout', () =>
  import(/* webpackChunkName: "dashboard" */ './layouts/Dashboard.vue')
);

// Register form alerts globally
Vue.component('form-alert', FormAlert);

// Check auth before loading page
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.secure)) {
    var token = store.getters.loggedIn;
    if (!token) {
      next({
        path: '/login'
      });
    } else {
      document.title = to.meta.title || 'DataARC Admin';
      next();
    }
  } else {
    next();
  }
});

// Setup ApolloClient
Vue.use(VueApollo);
export const defaultClient = new ApolloClient({
  uri: 'http://localhost:1337/graphql',
  // include auth token with requests made to backend
  fetchOptions: {
    credentials: 'include'
  },
  request: operation => {
    // if no token with key of 'token' in localStorage, add it
    if (!localStorage.token) {
      localStorage.setItem('token', '');
    }

    // operation adds the token to an authorization header, which is sent to backend
    operation.setContext({
      headers: {
        authorization: 'Bearer ' + localStorage.getItem('token')
      }
    });
  },
  onError: ({ graphQLErrors, networkError }) => {
    if (networkError) {
      console.log('[networkError]', networkError);
    }

    if (graphQLErrors) {
      for (let err of graphQLErrors) {
        console.dir(err);
        if (err.name === 'AuthenticationError') {
          // set auth error in state (to show in snackbar)
          store.commit('setAuthError', err);
          // signout user (to clear token)
          store.dispatch('logoutUser');
        }
      }
    }
  }
});

const apolloProvider = new VueApollo({ defaultClient });

Vue.config.productionTip = false;

new Vue({
  provide: apolloProvider.provide(),
  router,
  store,
  vuetify,
  render: h => h(App),
  created() {
    // execute getCurrentUser query
    this.$store.dispatch('getCurrentUser');
  }
}).$mount('#app');
