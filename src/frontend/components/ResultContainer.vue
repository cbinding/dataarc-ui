<template>
  <section id="result-section" class="bg-dark text-white">
    <results
      v-for="(result, index) in resultTypes"
      :key="index"
      :filters="filters"
      :result-type="result"
      :result-types="resultTypes"
      @resultsCount="setResultsCount"
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
    setResultsCount(val) {
      this.$emit('resultsCount', val)
    }
  },
};
</script>

<style></style>
