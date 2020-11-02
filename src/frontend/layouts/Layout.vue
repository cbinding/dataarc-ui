<template>
  <div id="page-top">
    <layout-header />
    <router-view />
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
}
</script>

<style lang="scss">

@import "../scss/global";

</style>
