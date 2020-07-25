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

// Plugins
import MyPlugin from './plugins/my-plugin'

// Globals
window.axios = require('axios')

// Apply imported libraries
Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)
Vue.use(VueApollo)

// Apply plugins
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
