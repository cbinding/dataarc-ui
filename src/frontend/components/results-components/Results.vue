<template>
  <div class="result-type-container text-center">
    <h2>
      <span class="result-type-title">
        {{ resultType }} Results
      </span>
    </h2>
    <div class="card-deck results-container">
      <result-column
        v-for="result in results"
        :key="result.category_id"
        :result="result"
        @result-data-view="setResultView"
      />
    </div>
    <result-view
      v-if="selectedResult"
      :result="selectedResult"
      :filters="filters"
    />
  </div>
</template>

<script>
import ResultColumn from './ResultColumn.vue'
import ResultView from './ResultView.vue'
export default {
  name: 'Results',
  components: {
    ResultColumn,
    ResultView,
  },
  props: {
    filters: {
      type: Object,
      required: true,
    },
    resultType: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      selectedResult: false,
      results: [],
      sampleResult: [
        {
          category: 'Archaeological',
          category_id: 1,
          totalCount: 500,
          counts: [
            {
              dataset: 'Test 1',
              dataset_id: 1,
              count: 3,
            },
          ],
        },
        {
          category: 'Environmental',
          category_id: 2,
          totalCount: 35000,
          counts: [
            {
              dataset: 'Test 1',
              dataset_id: 1,
              count: 3,
            },
          ],
        },
        {
          category: 'Textual',
          category_id: 3,
          totalCount: 35000,
          counts: [
            {
              dataset: 'Test 1',
              dataset_id: 1,
              count: 3,
            },
          ],
        },
      ],
    }
  },
  mounted() {
    this.results = this.sampleResult
  },
  methods: {
    setResultView(result) {
      console.log(result)
    },
  },
}
</script>

<style>
.results-container .card {
  background-color: inherit;
  border: 0;
}

.result-type-container {
  padding: 80px 0px;
  border-bottom: 1px solid gray;

  background-color: rgba(0, 0, 0, 0.4)
}

.result-type-title {
  text-transform: capitalize;
}

</style>
