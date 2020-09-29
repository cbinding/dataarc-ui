<template>
  <section
    id="temporal-section"
    class="bg-white"
  >
    <div class="container call-to-action">
      <div class="row">
        <div class="col-lg-12 text-center">
          <h2 class="section-heading">
            Timeline<sup><a
              href="http://www.data-arc.org/time/"
              class="text-dark"
              target="_blank"
              data-toggle="tooltip"
              title="How dataarc thinks about time"
            ><i class="fa fa-info-circle" /></a></sup>
          </h2>
          <hr class="primary">
          <p>Use the timeline to examine how data is distributed temporally.</p>
          <div class="legend justify-content-md-center">
            <ul class="list-inline">
              <li class="list-inline-item">
                <span class="legend-item legend-item-one">&nbsp;&nbsp;</span>
                <mark class="typetip">Archaeological</mark> Sources
              </li>
              <li class="list-inline-item">
                <span class="legend-item legend-item-two">&nbsp;&nbsp;</span>
                <mark class="typetip">Textual</mark> Sources
              </li>
              <li class="list-inline-item">
                <span class="legend-item legend-item-three">&nbsp;&nbsp;</span>
                <mark class="typetip">Environmental</mark> Sources
              </li>
            </ul>
          </div>
          <timeline />
          <button
            class="btn btn-primary"
            data-toggle="modal"
            data-target="#timeline-filter"
          >
            <i class="fa fa-filter text-white sr-icons" /> Temporal Filter
          </button>
        </div>
      </div>
    </div>
    <div
      id="timeline-filter"
      class="modal fade"
      tabindex="-1"
      role="dialog"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header text-light bg-dark">
            Temporal Filter
          </div>
          <div class="modal-body">
            <p>Select a pre-defined time period from the list or select "Custom" and enter your values below.</p>
            <form>
              <div class="form-row">
                <div class="col mb-3">
                  <label for="timeline-period">Time Period</label>
                  <select
                    id="timeline-period"
                    class="custom-select mr-sm-2"
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
                  >
                </div>
                <div class="col mb-3">
                  <label for="timeline-enddate">End Date *</label>
                  <input
                    id="timeline-enddate"
                    type="text"
                    class="form-control"
                    placeholder="end"
                  >
                </div>
              </div>
            </form>
            <p class="text-muted small">
              * A negative number is used to represent B.C.E. dates. E.g. -1000 = 1000 B.C.E.
            </p>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-dismiss="modal"
            >
              Cancel
            </button>
            <button
              type="button"
              class="btn btn-primary"
            >
              Apply Filter
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Timeline from './timeline-components/Timeline.vue'
export default {
  name: 'TimelineContainer',
  components: {
    Timeline,
  },
}
</script>

<style>

</style>
