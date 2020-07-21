import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';
import VueApollo from 'vue-apollo';
import ApolloClient from 'apollo-boost';
import App from './App.vue';
import router from './router';
import store from './store';
import MyPlugin from './plugins/my-plugin';

Vue.use(BootstrapVue);
Vue.use(VueApollo);
Vue.use(MyPlugin);

const apolloClient = new ApolloClient({
  uri: 'http://localhost:1337/graphql'
});

const apolloProvider = new VueApollo({
  defaultClient: apolloClient
});

Vue.config.productionTip = false;
Vue.prototype.$log = console.log;

new Vue({
  router,
  store,
  apolloProvider,
  render: h => h(App)
}).$mount('#app');
