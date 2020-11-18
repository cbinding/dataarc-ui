<template>
  <section id="timeline-section" class="bg-white">
    <b-container class="text-center pt-5 pb-5">
      <b-row>
        <b-col>
          <h2>
            Timeline
            <sup><a href="http://www.data-arc.org/time/" title="How dataarc thinks about time" class="text-dark" target="_blank" data-toggle="tooltip" ><b-icon-info-circle-fill /></a></sup>
          </h2>
          <hr class="primary">
          <p>Use the timeline to examine how data is distributed temporally.</p>
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
        <b-col ref="timelineContainer" class="mt-3 mb-3 text-center">
          <timeline :triggers="triggers" :filters="filters" :width="timelineWidth" v-model="currentSelectedRange" />
        </b-col>
      </b-row>
      <b-row>
        <b-col align-self="center">
          <b-button-group>
            <b-button
              title="View Temporal Filter Options"
              variant="primary"
              data-toggle="modal"
              v-b-modal.timeline-filter
            >
              <b-icon-filter aria-hidden="true" /> View Temporal Filter Options
            </b-button>
            <b-button
              title="Add Selected Range To Filter"
              variant="success"
              v-show="currentSelectedRange"
              :disabled="checkDuplicateRange()"
              @click.prevent="setSelectedRange"
            >
              <b-icon-plus aria-hidden="true" /> Add Selected Range To Filter
            </b-button>
          </b-button-group>
        </b-col>
      </b-row>
    </b-container>

    <b-modal
      id="timeline-filter"
      class="modal-dialog"
      aria-hidden="true"
      size="md"
      header-bg-variant="dark"
      header-text-variant="light"
      hide-header-close
    >
      <template class="modal-title" #modal-title>
        Temporal Filter
      </template>
      <template #default>
        <p>Select a pre-defined time period from the list or set a custom begin and end date below.</p>
        <form>
          <div class="form-row">
            <div class="col mb-3">
              <label for="timeline-period">Time Period</label>
              <select
                id="timeline-period"
                class="custom-select mr-sm-2"
                @change="setTimelineFilterPeriod"
                v-model="selectedFilterIndex"
              >
                <option v-for="(coverage, index) in temporalCoverages" :key="index" :value="index">
                  {{ coverage.title }}
                </option>
              </select>
            </div>
          </div>
          <div class="form-row">
            <div class="col mb-3">
              <label for="timeline-startdate">Begin Date *</label>
              <input
                id="timeline-begindate"
                type="text"
                class="form-control"
                placeholder="begin"
                v-model="selectedFilter.begin"
              >
            </div>
            <div class="col mb-3">
              <label for="timeline-enddate">End Date *</label>
              <input
                id="timeline-enddate"
                type="text"
                class="form-control"
                placeholder="end"
                v-model="selectedFilter.end"
              >
            </div>
          </div>
        </form>
        <p class="text-muted small">
          * A negative number is used to represent B.C.E. dates. E.g. -1000 = 1000 B.C.E.
        </p>
      </template>
      <template #modal-footer>
        <button
          type="button"
          class="btn btn-secondary"
          @click="$bvModal.hide('timeline-filter')"
        >
          Cancel
        </button>
        <button
          type="button"
          class="btn btn-success"
          :disabled="checkDuplicateTemporal()"
          @click="applyFilter"
        >
          Apply Filter
        </button>
      </template>
    </b-modal>
  </section>
</template>

<script>
import Timeline from './timeline-components/Timeline.vue'
export default {
  name: 'TimelineContainer',
  components: {
    Timeline,
  },
  props: {
    filters: {
      type: [Object, Boolean],
      default: false,
    },
    triggers: {
      type: [Number, Boolean],
      default: false,
    },
  },
  data() {
    return {
      timelineFilter: [],
      selectedFilterIndex: null,
      selectedFilter: {
        begin: null,
        end: null
      },
      timelineWidth: 1160,
      temporalCoverages: [],
      timelineSelected: null,
      currentSelectedRange: null
    }
  },
  mounted() {
    this.timelineWidth = this.$refs.timelineContainer.clientWidth
    this.getTemporalCoverages()
  },
  methods: {
    checkDuplicateTemporal() {
      let exists = []
      if (!this.selectedFilter || !this.selectedFilter.end || !this.selectedFilter.begin) {
        return true
      }
      if (this.filters && this.filters.temporal) {
        exists = this.filters.temporal.filter((filter) => {
          return (filter.end === this.selectedFilter.end) && (filter.begin === this.selectedFilter.begin)
        })
      }
      if (exists.length === 0) {
        return false
      }
      return true
    },
    checkDuplicateRange() {
      let exists = []
      if (!this.currentSelectedRange || this.currentSelectedRange.end === null || this.currentSelectedRange.begin === null) {
        return true
      }
      if (this.filters && this.filters.temporal) {
        exists = this.filters.temporal.filter((filter) => {
          return (filter.end === this.currentSelectedRange.end) && (filter.begin === this.currentSelectedRange.begin)
        })
      }
      if (exists.length === 0) {
        return false
      }
      return true
    },
    setTimelineFilterPeriod() {
      const time = this.temporalCoverages[this.selectedFilterIndex]
      this.selectedFilter.begin = time.begin
      this.selectedFilter.end = time.end
    },
    applyFilter(evt) {
      evt.preventDefault()
      this.timelineFilter.push({ ...this.selectedFilter })

      this.emitFilter()
      // console.log(val);
      this.$bvModal.hide('timeline-filter')
    },
    setSelectedRange() {
      this.timelineFilter.push({ ...this.currentSelectedRange })
      this.emitFilter()
    },
    emitFilter() {
      this.$emit('input', this.timelineFilter)
    },
    getTemporalCoverages() {
      return axios.get(`${this.$apiUrl}/temporal-coverages`)
        .then(({data}) => {
          this.temporalCoverages = data
        })
    }
  },
}
</script>

<style>

</style>
