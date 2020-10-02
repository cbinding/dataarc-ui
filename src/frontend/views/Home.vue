<template>
  <div>
    <data-arc />
  </div>
</template>

<script>

import DataArc from '../components/DataARC.vue'

export default {
  name: 'HomeView',
  components: {
    DataArc,
  },
}
</script>

<style lang="scss">
body {
  font-size: 1.25rem;
}
</style>
