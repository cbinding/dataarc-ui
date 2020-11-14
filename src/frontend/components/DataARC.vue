<template>
  <div>
    <div class="sticky-top">
      <b-button-group class="float-right border-0">
        <b-button
          href="#result-section"
          variant="dark"
        >
          Results
          <b-badge variant="danger">
            {{ resultsCount }}
          </b-badge>
        </b-button>
        <b-button
          href="#filter-section"
          variant="dark"
        >
          Filters
          <b-badge variant="success">
            {{ totalFilters }}
          </b-badge>
        </b-button>
      </b-button-group>
    </div>
    <timeline-section
      id="temporal-section"
      v-model="temporalFilters"
    />
    <map-section
      id="spatial-section"
      @filtered="processFilter"
    />
    <concept-section
      id="concept-section"
      @filtered="processFilter"
    />
    <keyword-section
      id="keyword-section"
      v-model="keywordFilters"
    />
    <filter-section
      id="filter-section"
      :filters="filters"
      @removed="removeFilter"
      @filters-loaded="loadFilters"
    />
    <result-section
      id="result-section"
      :filters="compiledFilters"
      @resultsCount="setCount"
    />
    <why-section
      id="why-section"
      :filters="filters"
    />
  </div>
</template>

<script>
import KeywordSection from './KeywordContainer.vue'
import TimelineSection from './TimelineContainer.vue'
import MapSection from './MapContainer.vue'
import ConceptSection from './ConceptContainer.vue'
import FilterSection from './FilterContainer.vue'
import ResultSection from './ResultContainer.vue'
import WhySection from './WhyContainer.vue'

export default {
  name: 'DataARC',
  components: {
    KeywordSection,
    TimelineSection,
    MapSection,
    ConceptSection,
    FilterSection,
    ResultSection,
    WhySection,
  },
  data() {
    return {
      filters: {},
      totalFilters: 0,
      keywordFilters: [],
      temporalFilters: [],
      resultsCount: 0,
    }
  },
  computed: {
    compiledFilters() {
      return this.collectFilters()
    },
  },
  watch: {
    keywordFilters() {
      if (this.keywordFilters.length > 0) {
        this.processFilter('keywords', this.keywordFilters)
      } else {
        this.removeFilter('keywords', -1)
      }
    },
    temporalFilters() {
      if (this.temporalFilters.length > 0) {
        this.processFilter('temporal', this.temporalFilters)
      } else {
        this.removeFilter('temporal', -1)
      }
    }
  },
  methods: {
    loadFilters(newFilters) {
      const keys = Object.keys(newFilters)

      keys.forEach((key, index) => {
        if (key === 'keywords') {
          this.keywordFilters = newFilters[key]
        } else if (key === 'temporal') {
          this.temporalFilters = newFilters[key]
        } else {
          this.processFilter(key, newFilters[key])
        }
      })
    },
    processFilter(type, filter) {
      if (!this.filters[type]) {
        this.totalFilters += 1
      }

      this.$set(this.filters, type, filter)
      // this.filters[type] = filter
      this.getResults()
    },
    removeFilter(type, index) {
      if (type === 'keywords' || type === 'temporal' && index > -1) {
        const references = {
          keywords: this.keywordFilters,
          temporal: this.temporalFilters
        }

        references[type].splice(index, 1)
        this.filters[type] = references[type]
        this.totalFilters -= 1
        return
      }
      // if (type === 'keywords') {
      //   this.filters[type] = ''
      // }
      // else {
      //   this.filters[type] = []
      // }
      this.$delete(this.filters, type)
      this.totalFilters -= 1
    },
    collectFilters() {
      const filters = { ...this.filters}
      if ('keywords' in filters && filters.keywords.length > 0) {
        filters.keywords = filters.keywords.join(' ')
      }
      return filters
    },
    getResults() {
      const filters = this.compiledFilters
      return axios
      .post(
        `${this.$apiUrl}/query/results`,
        filters,
        'matched',
      ).then((data) => {
        console.log(data)
      })
    },
    setCount(val) {
      this.resultsCount = val
    },
  },
}
</script>

<style></style>
