<template>
  <section
    id="concept-section"
    class="bg-white"
  >
    <div class="container call-to-action">
      <div class="row">
        <div class="col-lg-12 text-center">
          <h2 class="section-heading">
            Concepts<sup><a
              href="http://www.data-arc.org/conceptmapping/"
              class="text-dark"
              target="_blank"
              data-toggle="tooltip"
              title="How to use dataarc concepts in your search"
            ><i class="fa fa-info-circle" /></a></sup>
          </h2>
          <hr class="primary">
        </div>
        <div class="col-lg-12">
          <div
            id="topicControls"
            class="btn-toolbar justify-content-between"
          >
            <div class="btn-group">
              <button
                id="topicmapZoomIn"
                title="zoom in"
                class="btn btn-secondary"
              >
                <span class="fa fa-search-plus" />
              </button>
              <button
                id="topicmapZoomOut"
                title="zoom out"
                class="btn btn-secondary"
              >
                <span class="fa fa-search-minus" />
              </button>
              <button
                id="topicmapReset"
                title="reset"
                class="btn btn-secondary"
              >
                <span class="fa fa-repeat" />
              </button>
              <button
                id="topicmapPause"
                title="pause"
                class="btn btn-secondary"
              >
                <span class="fa fa-pause" />
              </button>
              <button
                id="topicmapProceed"
                title="continue"
                class="btn btn-secondary"
              >
                <span class="fa fa-play" />
              </button>
            </div>
            <div
              id="topicSearch"
              class="input-group"
            />
          </div>
          <div
            id="conceptContainer"
            style="width: 100%"
          >
            <div id="topicmap" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {

}
</script>

<style>

</style>
