<template>
  <div>
    <div class="sticky-top">
      <b-button href="#Results" class="float-right" variant="primary">Results <b-badge variant="danger">0</b-badge></b-button>
      <b-button href="#Filters" class="float-right" variant="primary">Filters <b-badge variant="success">{{ totalFilters }}</b-badge></b-button>
    </div>
    <timeline
      @filtered="processFilter"
    />
    <map-section
      @filtered="processFilter"
    />
    <concepts
      @filtered="processFilter"
    />
    <filters
      id="Filters"
      :filters="filters"
      @removed="removeFilter"
    />
    <results
      id="Results"
      :filters="filters"
    />
    <why
      id="Why"
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
import Filters from './FiltersContainer.vue'

export default {
  name: 'DataARC',
  components: {
    Timeline,
    MapSection,
    Concepts,
    Results,
    Why,
    Filters,
  },
  data() {
    return {
      filters: {
        spatial: [],
        temporal: [],
        conceptual: [],
      },
      totalFilters: 0,
    }
  },
  methods: {
    processFilter(type, filter) {
      this.filters[type].push(filter)
      this.totalFilters += 1
    },
    removeFilter(type, index) {
      this.filters[type].splice(index, 1)
      this.totalFilters -= 1
    },
  },
}
</script>

<style>

</style>
