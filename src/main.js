// Import scss styles
import '@/scss/style.scss'

// Base Vue Imports
import Vue from 'vue'
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'

// GraphQL Imports
import VueApollo from 'vue-apollo'
import apolloClient from '@/api/apollo-vue'

// App imports
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'

import Multiselect from 'vue-multiselect'

// Plugins
// import MultiSelect from 'vue-multiselect'
import VueFormGenerator from 'vue-form-generator'
import MyPlugin from './plugins/my-plugin'
import AsyncComputed from 'vue-async-computed'

// Globals
window.axios = require('axios')

// Apply imported libraries
Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)
Vue.use(VueApollo)
Vue.component('multiselect', Multiselect)
Vue.use(AsyncComputed)


// Vue.component('field-MultiSelect', require('vue-multiselect').default)

// Vue.component('field-MultiSelect', require('vue-multiselect').default)

// Apply plugins
Vue.use(VueFormGenerator)
Vue.use(MyPlugin)

// Log as components are created
Vue.mixin({
  created() {
    console.log(`[created] ${this.$options.name}`)
  },
})

const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
})

// base url for mongodb
Vue.prototype.$baseUrl = 'http://localhost:1337'
Vue.config.productionTip = false
Vue.prototype.$log = console.log

new Vue({
  router,
  store,
  apolloProvider,
  render: (h) => h(App),
}).$mount('#app')
