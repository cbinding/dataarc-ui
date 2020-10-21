<template>
  <section
    id="results-section"
    class="bg-dark text-white"
  >
    <results
      v-for="(result, index) in resultTypes"
      :key="index"
      :filters="filters"
      :result-type="result"
      :result-types="resultTypes"
    />
  </section>
</template>

<script>

import Results from './results-components/Results.vue'

export default {
  name: 'ResultsContainer',
  components: {
    Results,
  },
  props: {
    filters: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      resultTypes: [
        'matched', 'related', 'contextual',
      ],
    }
  },
}
</script>

<style>

</style>
