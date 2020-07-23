import Vue from 'vue';
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue';
import VueApollo from 'vue-apollo';
import ApolloClient from 'apollo-boost';
import '@/assets/styles/main.scss';
import App from './App.vue';
import router from './router';
import store from './store';
import MyPlugin from './plugins/my-plugin';

Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);
Vue.use(VueApollo);
Vue.use(MyPlugin);

// Log as components are created
Vue.mixin({
  created() {
    console.log('[created] ' + this.$options.name);
  }
});

const apolloClient = new ApolloClient({
  uri: 'http://localhost:1337/graphql'
});

const apolloProvider = new VueApollo({
  defaultClient: apolloClient
});

//base url for mongodb
Vue.prototype.$baseUrl = 'http://localhost:1337';
Vue.config.productionTip = false;
Vue.prototype.$log = console.log;

new Vue({
  router,
  store,
  apolloProvider,
  render: h => h(App)
}).$mount('#app');
