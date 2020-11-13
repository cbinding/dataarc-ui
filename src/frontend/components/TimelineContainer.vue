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
        <b-col class="mt-3 mb-3">
          <timeline :width="timelineWidth" />
          <button class="btn btn-primary" data-toggle="modal" v-b-modal.timeline-filter>
            <fa-icon-filter /> Temporal Filter
          </button>
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
        <p>Select a pre-defined time period from the list or select "Custom" and enter your values below.</p>
        <form>
          <div class="form-row">
            <div class="col mb-3">
              <label for="timeline-period">Time Period</label>
              <select
                id="timeline-period"
                class="custom-select mr-sm-2"
                v-model="timelineFilter.period"
              >
                <option selected>
                  Custom
                </option>
              </select>
            </div>
          </div>
          <div class="form-row">
            <div class="col mb-3">
              <label for="timeline-startdate">Start Date *</label>
              <input
                id="timeline-startdate"
                type="text"
                class="form-control"
                placeholder="start"
                v-model="timelineFilter.start"
              >
            </div>
            <div class="col mb-3">
              <label for="timeline-enddate">End Date *</label>
              <input
                id="timeline-enddate"
                type="text"
                class="form-control"
                placeholder="end"
                v-model="timelineFilter.end"
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
          class="btn btn-primary"
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
  data() {
    return {
      timelineFilter: {
        period: '',
        start: 0,
        end: 0,
      },
      timelineWidth: 1160,
    }
  },
  mounted() {
    this.timelineWidth = this.$refs.timelineContainer.clientWidth
  },
  methods: {
    applyFilter(evt) {
      evt.preventDefault()
      this.$emit('filtered', 'temporal', this.timelineFilter)
      // console.log(val);
      this.$bvModal.hide('timeline-filter')
    }
  },
}
</script>

<style>

</style>
