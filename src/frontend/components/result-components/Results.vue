<template>
  <section :class="'bg-'+resultType">
    <b-container class="text-center pt-5 pb-5">
      <b-row>
        <b-col>
          <h2 class="text-capitalize">
            {{ resultType }} Results
          </h2>
          <hr class="bg-light">
        </b-col>
      </b-row>
      <b-row>
        <b-col class="mt-3 mb-3">
          <b-card-group deck>
            <result-column
              v-for="result in sortedResults"
              :class="'bg-'+resultType"
              :key="result.category_id"
              :result="result"
              @result-data-view="setResultView"
            />
          </b-card-group>
          <result-view
            v-if="selectedResult"
            :key="resultType"
            :source="selectedResult"
            :filters="filters"
            :resultType="resultType"
            @modal-closed="clear"
          />
        </b-col>
      </b-row>
    </b-container>
  </section>
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
    resultTypes: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      selectedResult: false,
      results: [],
      resultsCount: 0,
    }
  },
  computed: {
    sortedResults() {
      return _.orderBy(this.results, ['category'])
    },
  },
  watch: {
    filters: {
      handler(newVal, oldVal) {
        if (newVal) {
          let postObject = {
            type: this.resultType
          }
          postObject = Object.assign(postObject, this.filters)
          axios.post(`${this.$apiUrl}/query/results`, postObject).then((data) => {
            this.results = data.data
            this.resultsCount = 0
            if (this.resultType === 'matched') {
              this.results.forEach((result) => {
                this.resultsCount += result.total
              })
            }
          })
        }
      },
      deep: true,
    },
    resultsCount(val) {
      this.$emit('resultsCount', val)
    },
  },
  mounted() {
    let postObject = {
      type: this.resultType
    }
    postObject = Object.assign(postObject, this.filters)
    axios.post(`${this.$apiUrl}/query/results`, postObject).then((data) => {
      this.results = data.data
      if (this.resultType === 'matched') {
        this.resultsCount = 0
        this.results.forEach((result) => {
          this.resultsCount += result.total
        })
        this.$emit('resultsCount', this.resultsCount)
      }
    })
    // axios.post(`${this.$apiUrl}/query/results`, this.filters, 'matched').then((data) => {
    //   console.log(data);
    //   this.results = data
    // })
    // this.results = this.sampleResult
  },
  methods: {
    setResultView(source, result) {
      this.selectedResult = source
      this.selectedResult.result = result
    },
    clear() {
      this.selectedResult = false
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
