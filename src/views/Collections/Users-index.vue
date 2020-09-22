<template>
  <b-container fluid>
    <b-col sm="2">
      <b-alert variant="success" dismissible fade :show="dismissCountDown" @dismiss-count-down="countDownChanged">
        Success
      </b-alert>
    </b-col>
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
      <template v-slot:table>
        <b-table
          ref="users"
          id="users"
          table-variant="light"
          head-variant="light"
          :filter="filter"
          :items="users.items"
          :fields="displayFields"
          @filtered="updatePagination"
        >
          <template v-slot:cell(confirmed)="row">
            <b-form-checkbox v-model="row.item.confirmed" @change="row.item.confirmed != row.item.confirmed" />
          </template>
          <template v-slot:cell(blocked)="row">
            <b-form-checkbox v-model="row.item.blocked" @change="row.item.blocked != row.item.blocked" />
          </template>
          <template v-slot:cell(role)="row">
            <div v-if="row.item.role.name">
              <b-dropdown :text="row.item.role.name">
                <div v-for="role in roles" :key="role.id">
                  <b-dropdown-item v-model="row.item.role" @click="row.item.role = role">
                    {{ role.name }}
                  </b-dropdown-item>
                </div>
              </b-dropdown>
            </div>
          </template>

          <template v-slot:cell(actions)="row" class="actions">
            <b-button-group>
              <b-button size="sm" variant="primary" v-text="'Delete'" @click="itemToDelete = row.item" v-b-modal.deleteConfirmation />
            </b-button-group>
            <b-button-group>
              <b-button size="sm" variant="primary" v-text="'Save'" @click="updateUser(row.item)"></b-button>
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
      displayFields: ['actions', 'username', 'email', 'confirmed', 'blocked', 'role'],
      total: '',
      dismissSecs: 3,
      dismissCountDown: 0,
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
        this.rows = this.total
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
    updateUser(val) {
      let temp = val
      temp.type = 'Users'
      temp.action = 'Update'
      this.setFormData(temp)
    },
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown
    },
    showAlert() {
      this.dismissCountDown = this.dismissSecs
    },
  },
}
</script>
