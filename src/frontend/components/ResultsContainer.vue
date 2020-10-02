<template>
  <section
    id="results-section"
    class="bg-dark text-white"
  >
    <div class="call-to-action">
      <div class="container text-center">
        <h2 class="section-heading">
          Results
        </h2>
        <hr class="primary">
        <p>&nbsp;</p>
        <results
          v-for="(result, index) in resultTypes"
          :key="index"
          :filters="filters"
          :result-type="result"
        />
      </div>
    </div>
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
