<template>
  <div>
    <data-arc :sampleFilter="sampleFilter" @sign-in="$emit('sign-in')"/>
  </div>
</template>

<script>

import DataArc from '../components/DataARC.vue'

export default {
  name: 'HomeView',
  props: {
    sampleFilter: {
      type: String,
      required: true
    },
  },
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
