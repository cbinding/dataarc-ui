<template>
  <section id="filter-section" class="bg-secondary text-white">
    <div class="call-to-action">
      <div class="container text-center">
        <h2 class="section-heading">
          Filters
        </h2>
        <hr />
        <div id="filters" class="row" v-if="filters">
          &nbsp;
          <div
            class="col-sm filters-container"
            id="filters-spatial"
            v-if="filters.spatial.length"
          >
            <h3>Spatial</h3>
            <div
              class="p-3 mb-2 filter-spatial text-white"
              data-type="spatial"
              v-for="(filter, index) in filters.spatial"
              :key="index"
            >
              {{ filter }}
              <button
                type="button"
                class="close text-light filters-remove"
                @click="$emit('removed', 'spatial', index)"
                aria-label="Remove"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
          </div>
          <div
            class="col-sm filters-container"
            id="filters-temporal"
            v-if="filters.temporal.length"
          >
            <h3>Temporal</h3>
            <div
              class="p-3 mb-2 filter-temporal text-white"
              data-type="temporal"
              v-for="(filter, index) in filters.temporal"
              :key="index"
            >
              <span v-if="filter.period !== 'Custom'">
                {{ filter.period }}
              </span>
              <span v-else> {{ filter.start }} - {{ filter.end }} </span>
              <button
                type="button"
                class="close text-light filters-remove"
                @click="$emit('removed', 'temporal', index)"
                aria-label="Remove"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
          </div>
          <div
            class="col-sm filters-container"
            id="filters-concepts"
            v-if="filters.conceptual.length"
          >
            <h3>Concepts</h3>
            <div
              class="p-3 mb-2 filter-concepts text-white"
              data-type="concepts"
              v-for="(filter, index) in filters.conceptual"
              :key="index"
            >
              {{ filter.title }}
              <button
                type="button"
                class="close text-light filters-remove"
                @click="$emit('removed', 'conceptual', index)"
                aria-label="Remove"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
          </div>
        </div>
        <button id="filter-save" class="btn btn-primary disabled" disabled>
          <i class="fa fa-bookmark sr-icons" /> Save Search
        </button>
        <button id="filter-share" class="btn btn-primary">
          <i class="fa fa-print sr-icons" /> Share Search
        </button>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    filters: {
      type: Object,
      required: true
    }
  }
};
</script>

<style lang="scss">
#filters {
  margin-bottom: 40px;
  text-transform: capitalize;
}

#filters h3:first-letter {
  text-transform: capitalize;
}

/* filter type colors */
.filter-keywords {
  background-color: #777;
}
.filter-temporal {
  background-color: #555;
}
.filter-spatial {
  background-color: #444;
}
.filter-concepts {
  background-color: #666;
}
</style>
