<template>
  <b-container fluid>
    <h3>{{component}}</h3>
    <small>{{rows ? rows : 0 }} entries found</small>
    <div class="d-flex justify-content-end">
      <slot name="button"/>
    </div>
    <br>
    <b-pagination
      v-model="currentPage"
      @change="notify"
      :total-rows="rows"
      :per-page="(perPage === 0 ? 10 : perPage)"
      :limit="4"
      first-number
      last-number
    />
    <slot name="table"/>
    <b-modal hide-backdrop content-class="shadow" centered id="deleteConfirmation">
      <template v-slot:modal-title>
        Delete Confirmation
      </template>
      <p class="my-2">
        Are you sure you want to delete this {{ component }}?
      </p>
      <template v-slot:modal-footer="{ ok, cancel }">
        <b-button size="sm" @click="cancel()">
          Cancel
        </b-button>
        <b-button size="sm" variant="danger" @click="$emit('deleteConfirmed')">
          Delete
        </b-button>
      </template>
    </b-modal>
    <div>
      <b-dropdown id="dropdown-1" :text="perPage.toString()" class="m-md-2">
        <div v-for="limit in limits" :key="limit">
          <b-dropdown-item @click="$emit('limitUpdated', limit, component)">{{limit}}</b-dropdown-item>
        </div>
      </b-dropdown>
      <small>entries per Page</small>
    </div>
  </b-container>
</template>

<script>
export default {
  name: 'TableLayout',
  props: [
    'rows',
    'currentPage',
    'perPage',
    'limits',
    'component'
  ],
  data() {
    return {

    }
  },
  methods: {
    notify(val) {
      this.$emit('change', val, this.component)
    }
  },

}
</script>

<style>

</style>
