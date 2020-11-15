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
      :filters="compiledFilters"
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
      :concept-filters="conceptFilters"
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
      conceptFilters: [],
    }
  },
  computed: {
    compiledFilters() {
      return this.collectFilters()
    },
  },
  watch: {
    keywordFilters(newVal, oldVal) {
      if (newVal.length > 0 && newVal.length > oldVal.length) {
        this.processFilter('keyword', newVal)
      } else if (this.filters.keyword && newVal.length !== this.filters.keyword.length) {
        this.removeFilter('keyword', -1)
      }
    },
    temporalFilters(newVal, oldVal) {
      if (this.temporalFilters && this.temporalFilters.length > 0) {
        this.processFilter('temporal', this.temporalFilters)
      } else if (this.filters.temporal && newVal.length !== this.filters.temporal.length) {
        this.removeFilter('temporal', -1)
      }
    },
  },
  methods: {
    loadFilters(newFilters) {
      const keys = Object.keys(newFilters)

      keys.forEach((key, index) => {
        if (key === 'keyword') {
          this.keywordFilters = newFilters[key]
        } else if (key === 'temporal') {
          this.temporalFilters = newFilters[key]
        } else {
          this.processFilter(key, newFilters[key])
        }
      })
    },
    processFilter(type, filter) {
      if (type === 'concept') {
        this.$set(this.conceptFilters, this.conceptFilters.length, filter)
        if (!this.filters[type]) {
          this.$set(this.filters, type, [])
        }
        this.$set(this.filters[type], this.filters[type].length, filter.id)
      }
      else {
        this.$set(this.filters, type, filter)
      }
      this.getResults()
    },
    removeFilter(type, index) {
      if (type === 'box' || type === 'polygon') {
        this.$delete(this.filters, type)
        return
      }
      if (type === 'concept') {
        this.filters[type].splice(index, 1)
        this.conceptFilters.splice(index, 1)
        if (this.filters[type].length === 0) {
          this.$delete(this.filters, type)
        }
        return
      }
      if ((type === 'keyword' || type === 'temporal') && index > -1) {
        const references = {
          keyword: this.keywordFilters,
          temporal: this.temporalFilters,
        }
        references[type].splice(index, 1)
        this.filters[type] = references[type]
        if (this.filters[type].length === 0) {
          this.$delete(this.filters, type)
        }
        return
      }
      if (index === -1 && type === 'keyword') {
        this.totalFilters -= this.filters[type].length
        this.filters[type] = this[`${type}Filters`]
        this.totalFilters += this.filters[type].length
        if (this.totalFilters <= 0) {
          this.filters = {}
          this.totalFilters = 0
        }
        return
      }
      if (this.filters[type] && this.filters[type].length > 0) {
        this.filters[type].splice(index, 1)
        if (this.filters[type].length === 0) {
          this.$delete(this.filters, type)
        }
      }
      else {
        this.$delete(this.filters, type)
      }
    },
    collectFilters() {
      const filters = { ...this.filters }
      this.totalFilters = 0
      const keys = Object.keys(filters)
      const array = Object.values(filters)
      array.forEach((filter, index) => {
        if (keys[index] === 'box' || keys[index] === 'polygon') {
          this.totalFilters += 1
        }
        else {
          this.totalFilters += filter.length
        }
      })

      if ('keyword' in filters && filters.keyword.length > 0) {
        filters.keyword = filters.keyword.join(' ')
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
