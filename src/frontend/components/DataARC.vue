<template>
  <div>
    <div class="sticky-top">
      <b-button-group class="float-right">
        <b-button href="#result-section" variant="dark">
          Results
          <b-badge variant="danger">0</b-badge></b-button
        >
        <b-button href="#filter-section" variant="dark">
          Filters
          <b-badge variant="success">{{ totalFilters }}</b-badge></b-button
        >
      </b-button-group>
    </div>
    <keyword-section id="keyword-section" :filters="filters" />
    <timeline-section id="temporal-section" @filtered="processFilter" />
    <map-section id="spatial-section" @filtered="processFilter" />
    <concept-section id="concept-section" @filtered="processFilter" />
    <filter-section
      id="filter-section"
      :filters="filters"
      @removed="removeFilter"
    />
    <result-section id="result-section" :filters="filters" />
    <why-section id="why-section" :filters="filters" />
  </div>
</template>

<script>
import KeywordSection from './KeywordContainer.vue';
import TimelineSection from './TimelineContainer.vue';
import MapSection from './MapContainer.vue';
import ConceptSection from './ConceptContainer.vue';
import FilterSection from './FilterContainer.vue';
import ResultSection from './ResultContainer.vue';
import WhySection from './WhyContainer.vue';

export default {
  name: 'DataARC',
  components: {
    KeywordSection,
    TimelineSection,
    MapSection,
    ConceptSection,
    FilterSection,
    ResultSection,
    WhySection
  },
  data() {
    return {
      filters: {
        spatial: [],
        temporal: [],
        conceptual: []
      },
      totalFilters: 0
    };
  },
  methods: {
    processFilter(type, filter) {
      this.filters[type].push(filter);
      this.totalFilters += 1;
    },
    removeFilter(type, index) {
      this.filters[type].splice(index, 1);
      this.totalFilters -= 1;
    }
  }
};
</script>

<style></style>
