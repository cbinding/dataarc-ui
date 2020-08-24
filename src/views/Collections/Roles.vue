<template>
  <b-container fluid>
    <router-view />
    <table-view-layout
      :rows="items.length"
      :limits="limits"
      :current-page="currentPage"
      :per-page="perPage"
    >
      <template v-slot:button>
        <b-button
          variant="primary"
          :to="{name: 'Create Role' }"
        >
          <b-icon-plus />Add new Role
        </b-button>
      </template>
      <template v-slot:table>
        <b-table
          :responsive="true"
          table-variant="light"
          head-variant="light"
          :items="items"
          :fields="displayFields"
        >
          <template
            v-slot:cell(actions)="row"
            class="actions"
          >
            <b-link
              v-if="row.item"
              size="sm"
              class="mb-2"
              :to="{name: 'Update Role', params: {id: row.item.id} }"
            >
              <b-icon-pencil-square style="padding=50px;" />
            </b-link>
            <b-link
              v-if="row.item"
              v-b-modal.deleteConfirmation
              size="sm"
              class="mb-2"
              @click="itemToDelete = row.item"
            >
              <b-icon-trash />
            </b-link>
          </template>
        </b-table>
      </template>
    </table-view-layout>
  </b-container>
</template>

<script>
import { mapState, mapActions } from 'vuex'

import Role from '@/models/Role'
import TableViewLayout from '@/views/Collections/templates/TableViewLayout.vue'


export default {
  components: {
    TableViewLayout,
  },
  data() {
    return {
      model: Role,
      items: [],
      currentPage: 1,
      perPage: 10,
      limits: [10, 20, 50, 100],
    }
  },
  computed: {
    displayFields() {
      return this.model.public
    },
  },
  watch: {
    $route(to, from) {
      this.getInitialData()
    },
    items(val) {
      return val.length
    },
  },
  created() {
    this.getInitialData()
  },
  methods: {
    getInitialData() {
      this.model.all().then((items) => {
        this.items = items
      })
      // this.getAllUsers()
    },
  },
}
</script>
