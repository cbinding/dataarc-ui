
<template>
  <b-card no-body>
    <b-card-title class="mt-3 display-4" :class="'text-'+category.toLowerCase()">
      {{ category }}
      <hr>
      <p class="display-2">{{ result.total.toLocaleString() }}</p>
    </b-card-title>
    <b-card-sub-title class="mb-2">Sources</b-card-sub-title>
    <b-list-group>
      <b-list-group-item
        class="d-flex justify-content-between align-items-center text-left"
        href="#"
        v-for="(source, index) in result.datasets"
        :key="index"
        @click="viewData(source)"
      >
        {{ source.dataset }}
        <b-badge variant="dark">{{ source.total }}</b-badge>
      </b-list-group-item>
    </b-list-group>
  </b-card>

</template>

<script>
export default {
  name: 'ResultColumn',
  props: {
    result: {
      type: Object,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
  },
  methods: {
    viewData(source) {
      this.$emit('result-data-view', source, this.category)
    },
  },
}
</script>

<style>

</style>
