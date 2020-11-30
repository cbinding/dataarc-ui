<template>
  <div id="page-top">
    <layout-header :triggerLogin="triggerLogin"/>
    <router-view @sign-in="triggerLogin = true"/>
    <layout-footer />
  </div>
</template>

<script>

import LayoutHeader from './Header.vue'
import LayoutFooter from './Footer.vue'

export default {
  name: 'FrontendLayout',
  components: {
    LayoutHeader,
    LayoutFooter,
  },
  data() {
    return {
      triggerLogin: false
    }
  },
  watch: {
    triggerLogin(val) {
      if (val) {
        setTimeout(() => this.triggerLogin = false, 1000);
      }
    }
  }
}
</script>

<style lang="scss">

@import "../scss/global";

</style>
