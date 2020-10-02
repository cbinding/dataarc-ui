<template>
  <div>
    <timeline />
    <map-section />
    <concepts />
    <results />
    <why />
  </div>
</template>

<script>

import Timeline from '../components/TimelineContainer.vue'
import MapSection from '../components/MapContainer.vue'
import Concepts from '../components/ConceptsContainer.vue'
import Results from '../components/ResultsContainer.vue'
import Why from '../components/WhyContainer.vue'

export default {
  name: 'HomeView',
  components: {
    Timeline,
    MapSection,
    Concepts,
    Results,
    Why,
  },
}
</script>

<style lang="scss">
body {
  font-size: 1.25rem;
}
</style>
