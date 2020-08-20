<template>
  <b-container fluid>
    <router-view/>
    <table-view-layout :rows="rows" :component="component" :limits="limits" :currentPage="currentPage" :perPage="perPage" @change="updatePage" @deleteConfirmed="deleteItem(itemToDelete, 'Users')" @limitUpdated="updateLimit">
      <template v-slot:button>
        <b-button variant="primary" :to="{name: 'Create User' }"><b-icon-plus></b-icon-plus>Add new User</b-button>
      </template>
      <template v-slot:table>
        <b-table :responsive="true" table-variant="light" head-variant="light" :items="users.items" :fields="displayFields">
          <template v-slot:cell(actions)="row" class="actions">
            <b-link v-if="row.item" size="sm" class="mb-2" :to="{name: 'Update User', params: {id: row.item.id} }">
              <b-icon-pencil-square style="padding=50px;"></b-icon-pencil-square>
            </b-link>
            <b-link v-if="row.item" size="sm" class="mb-2" v-b-modal.deleteConfirmation @click="itemToDelete = row.item">
              <b-icon-trash></b-icon-trash>
            </b-link>
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
  data() {
    return {
      component: 'Users',
      displayFields: ['id', 'username', 'email', 'confirmed', 'actions'],
      total: ''
    }
  },
  mixins: [collectionMixin],
  computed: {
    ...mapState({
      account: state => state.account,
      users: state => state.users.all,
      user: state => state.users.user
    }),
  },
  created() {
    this.getInitialData()
  },
  watch: {
    $route(to, from) {
      this.getAllUsers()
    },
    users(val) {
      if (val.items) {
        this.total = val.items.length
      }
    }
  },
  methods: {
    ...mapActions('users', {
      getAllUsers: 'getAll',
      getById: 'getById',
      deleteUser: 'delete'
    }),
    getInitialData() {
      this.getAllUsers()
    },
  },
}
</script>
