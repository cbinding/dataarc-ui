<template>
  <div>
    <timeline />
    <map-section />
    <concepts />
  </div>
</template>

<script>

import Timeline from '../components/TimelineContainer.vue'
import MapSection from '../components/MapContainer.vue'
import Concepts from '../components/ConceptsContainer.vue'

export default {
  name: 'HomeView',
  components: {
    Timeline,
    MapSection,
    Concepts,
  },
}
</script>

<style lang="scss">

</style>
