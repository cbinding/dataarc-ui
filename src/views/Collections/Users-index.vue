<template>
  <b-container fluid>
    <table-view-layout
      :rows="rows"
      :component="component"
      :limits="limits"
      :current-page="currentPage"
      :per-page="perPage"
      @inputChanged="updateFilter"
      @change="updatePage"
      @deleteConfirmed="deleteItem(itemToDelete, 'Users')"
      @limitUpdated="updateLimit"
    >
      <template v-slot:button>
        <b-button
          variant="primary"
          :to="{name: 'Create User' }"
        >
          <b-icon-plus />Add new User
        </b-button>
      </template>
      <template v-slot:table>
        <b-table
          :responsive="true"
          table-variant="light"
          head-variant="light"
          :filter="filter"
          :items="users.items"
          :fields="displayFields"
          @filtered="updatePagination"
        >
          <template
            v-slot:cell(role)="row"
          >
            <b-link
              :to="{ name: 'Update Role', params: {id: row.item.role.id }}"
            >
              {{ row.item.role.name }}
            </b-link>
          </template>
          <template v-slot:cell(actions)="row" class="actions">
            <b-button-group>
              <router-link :to="{name: 'Update User', params: {id: row.item.id} }">
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
import collectionMixin from '../../mixins/collectionMixin'
export default {
  mixins: [collectionMixin],
  data() {
    return {
      component: 'Users',
      displayFields: ['username', 'email', 'confirmed', 'role', 'actions'],
      total: '',
    }
  },
  computed: {
    ...mapState({
      account: (state) => state.account,
      users: (state) => state.users.all,
      user: (state) => state.users.user,
    }),
  },
  watch: {
    $route(to, from) {
      this.getAllUsers()
    },
    users(val) {
      if (val.items) {
        this.total = val.items.length
      }
    },
  },
  created() {
    this.getInitialData()
  },
  methods: {
    ...mapActions('users', {
      getAllUsers: 'getAll',
      getById: 'getById',
      deleteUser: 'delete',
    }),
    getInitialData() {
      this.getAllUsers()
    },
  },
}
</script>
