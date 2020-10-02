<template>
  <div class="card text-center results-category">
    <div class="card-body">
      <h3 class="card-title typetip">
        {{ result.category }}
      </h3>
      <hr>
      <p class="card-text">
        {{ result.total }}
      </p>
      <!-- <h5>Sources</h5>
      <hr> -->
      <ul class="list-group">
        <li
          v-for="(source, index) in result.counts"
          :key="index"
          class="list-group-item d-flex justify-content-between align-items-center text-left results-source"
        >
          {{ source.dataset }}
          <span class="badge badge-dark">
            {{ source.count }}
          </span>
        </li>
      </ul>
    </div>
    <div class="card-footer">
      <button
        class="btn btn-block btn-primary"
        @click.prevent="viewData"
      >
        View Data
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ResultColumn',
  props: {
    result: {
      type: Object,
      required: true,
    },
  },
  methods: {
    viewData() {
      this.$emit('result-data-view', this.result)
    },
  },
}
</script>

<style>
.results-category h4 {
  color: #fefefe;
  text-transform:capitalize;
}

.results-category h5 {
  font-size: 1rem;
  text-transform:capitalize;
}

.results-category hr {
  border-color: #999;
  max-width: 25%;
  border-width: 1px;
  opacity: 0.25;
}

.results-category hr:first-of-type {
  max-width: 50%;
  border-width: 2px;
  opacity: 0.50;
}

.results-category .card-text {
  font-size: 3rem;
}

.results-category .card-footer {
  background: inherit;
  border: 0;
}
.results-category .list-group {
  border: 0;
}
.results-category .list-group-item {
  background: inherit;
  border: 0;
  padding: .25rem;
}

/* category colors */
.results-archaeological h4,
.results-archaeological .card-text {
  color: #6177aa;
}
.results-archaeological hr {
  border-color: #6177aa;
}
.results-environmental h4,
.results-environmental .card-text {
  color: #66c2a5;
}
.results-environmental hr {
  border-color: #66c2a5;
}
.results-textual h4,
.results-textual .card-text {
  color: #fc8d62;
}
.results-textual hr {
  border-color: #fc8d62;
}

</style>
