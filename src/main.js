// Import scss styles
import '@/scss/style.scss';

// Base Vue Imports
import Vue from 'vue';
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue';

// GraphQL Imports
import VueApollo from 'vue-apollo';
import apolloClient from '@/api/apollo-vue';

// App imports
import App from '@/App.vue';
import router from '@/router';
import store from '@/store';

import Multiselect from 'vue-multiselect';

// Plugins
import VueFormGenerator from 'vue-form-generator';
import AsyncComputed from 'vue-async-computed';
import Debug from '@/components/partials/Debug.vue';
import MyPlugin from './plugins/my-plugin';
import fieldQuery from './views/Collections/templates/fieldQuery.vue';

// Globals
window.axios = require('axios');

// Apply imported libraries
Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);
Vue.use(VueApollo);
Vue.component('multiselect', Multiselect);
Vue.use(AsyncComputed);
Vue.component('Debug', Debug);
Vue.component('fieldQuery', fieldQuery);

// Apply plugins
Vue.use(VueFormGenerator);
Vue.use(MyPlugin);

// Log as components are created
Vue.mixin({
  created() {
    // console.log(`[created] ${this.$options.name}`)
  },
});

const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
});

// base url for mongodb
Vue.prototype.$apiUrl = process.env.VUE_APP_API_URL;
Vue.config.productionTip = false;
Vue.prototype.$log = console.log;
Vue.prototype.$DEBUG = process.env;

const app = new Vue({
  router,
  store,
  apolloProvider,
  render: (h) => h(App),
}).$mount('#app');
