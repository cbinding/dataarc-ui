<template>
  <div class="card text-center results-category">
    <div class="card-body">
      <h4 class="card-title typetip">
        {{ result.category }}
      </h4>
      <hr>
      <p class="card-text">
        {{ result.total }}
      </p>
      <h5>Sources</h5>
      <hr>
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
      this.$emit('result-data-view', result)
    },
  },
}
</script>

<style>

</style>
