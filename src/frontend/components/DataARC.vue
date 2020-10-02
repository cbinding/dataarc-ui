<template>
  <div>
    <timeline
      @filtered="processFilter"
    />
    <map-section
      @filtered="processFilter"
    />
    <concepts
      @filtered="processFilter"
    />
    <results
      :filters="filters"
    />
    <why
      :filters="filters"
    />
  </div>
</template>

<script>

import Timeline from './TimelineContainer.vue'
import MapSection from './MapContainer.vue'
import Concepts from './ConceptsContainer.vue'
import Results from './ResultsContainer.vue'
import Why from './WhyContainer.vue'

export default {
  name: 'DataARC',
  components: {
    Timeline,
    MapSection,
    Concepts,
    Results,
    Why,
  },
  data() {
    return {
      filters: {
        spatial: [],
        temporal: [],
        conceptual: [],
      },
    }
  },
  methods: {
    processFilter({ type, filter }) {
      this.filters[type].push(filter)
    },
    removeFilter(type, index) {
      this.filters[type].splice(index, 1)
    },
  },
}
</script>

<style>

</style>
