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
          <template v-slot:cell(actions)="row" class="actions">
            <b-button-group>
              <router-link :to="{name: 'Update Role', params: {id: row.item.id} }">
                <b-button size="sm" variant="primary" v-text="'Edit'"></b-button>
              </router-link>
              <b-button size="sm" variant="primary" v-text="'Delete'" @click="itemToDelete = row.item" v-b-modal.deleteConfirmation></b-button>
            </b-button-group>
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
