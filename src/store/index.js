import Vue from 'vue'
import Vuex from 'vuex'

// import * as modules from './modules'

import account from './modules/account.module'
import alert from './modules/alert.module'
import users from './modules/users.module'

Vue.use(Vuex)

const store = new Vuex.Store({
  // modules,
  modules: {
    alert,
    account,
    users,
  },
})

export default store
