<template>
  <section id="results-section" class="bg-white">
    <b-container class="text-center pt-5 pb-5">
      <b-row>
        <b-col>
          <h2>
            Results
          </h2>
          <hr class="primary">
          <p>Use the results to examine data that matches your filters as well as data that is related to those matched results.</p>
        </b-col>
      </b-row>
      <b-row class="justify-content-md-center">
        <b-col align-self="center" md="auto">
          <b-icon-circle-fill class="text-archaeological"/>
          <mark class="typetip">Archaeological</mark> Sources
        </b-col>
        <b-col align-self="center" md="auto">
          <b-icon-circle-fill class="text-textual"/>
          <mark class="typetip">Textual</mark> Sources
        </b-col>
        <b-col align-self="center" md="auto">
          <b-icon-circle-fill class="text-environmental"/>
          <mark class="typetip">Environmental</mark> Sources
        </b-col>
      </b-row>
      <b-row>
        <b-col class="mt-3 mb-3">
          <results
            v-for="(result, index) in resultTypes"
            :key="index"
            :filters="filters"
            :result-type="result"
            :result-types="resultTypes"
            @resultsCount="setResultsCount"
          />
        </b-col>
      </b-row>
    </b-container>
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
