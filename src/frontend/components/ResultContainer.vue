<template>
  <section id="results-section">
    <results
      v-for="(result, index) in resultTypes"
      :key="index"
      :filters="filters"
      :result-type="result"
      :result-types="resultTypes"
      @resultsCount="emitResultsCount"
      @resultsUpdated="emitResults"
      @load-video="emitFileName"
    />
  </section>
</template>

<script>
import Results from './result-components/Results.vue';

export default {
  name: 'ResultContainer',
  components: {
    Results
  },
  props: {
    filters: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      resultTypes: ['matched', 'related', 'contextual']
    };
  },
  methods: {
    emitResultsCount(val) {
      this.$emit('resultsCount', val)
    },
    emitResults(val, type) {
      this.$emit('resultsUpdated', val, type )
    },
    emitFileName(val) {
      this.$emit('load-video', val )
    },
  },
};
</script>

<style></style>
