<template>
  <div>
    <b-container fluid>
      <router-view @submit="getAllUsers"></router-view>
      <h3>Users</h3>
      <div class="d-flex justify-content-end">
        <b-button variant="primary" :to="{name: 'createUser', params: {action:'Create', collectionType: 'Users'} }"><b-icon-plus></b-icon-plus>Add new User</b-button>
      </div>
      <br>
      <b-table :responsive="true" table-variant="light" head-variant="light" :items="users.items" :fields="displayFields">
        <template v-slot:cell(actions)="row" class="actions">
          <b-link v-if="row.item" size="sm" class="mb-2" :to="{name: 'editUser', params: {id: row.item.id, item: row.item, action:'Update', collectionType: 'Users'} }">
            <b-icon-pencil-square style="padding=50px;"></b-icon-pencil-square>
          </b-link>
          <b-link v-if="row.item" size="sm" class="mb-2" v-b-modal.deleteConfirmation @click="itemToDelete = row.item.id">
            <b-icon-trash></b-icon-trash>
          </b-link>
        </template>
      </b-table>
    </b-container>
    <b-modal hide-backdrop content-class="shadow" centered id="deleteConfirmation">
      <template v-slot:modal-title>
        Delete Confirmation
      </template>
      <p class="my-2">
        Are you sure you want to delete this User?
      </p>
      <template v-slot:modal-footer="{ ok, cancel }">
        <b-button size="sm" @click="cancel()">
          Cancel
        </b-button>
        <b-button size="sm" variant="danger" @click="deleteUser(itemToDelete)">
          Delete
        </b-button>
      </template>
    </b-modal>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import collectionMixin from '../../mixins/collectionMixin'
export default {
  data() {
    return {
      component: 'Users',
      displayFields: ['id', 'username', 'email', 'confirmed', 'actions'],
      deleteModal: false,
      itemToDelete: [],
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
    deleteUser(id) {
      this.$bvModal.hide('deleteConfirmation')
      let vm = this
      let url = ''
      url = `${this.$baseUrl}/users/${id}`
      axios
      .delete(url)
      .then((response) => {
        // Handle success.
        vm.getAllUsers()
      })
      .catch((error) => {
        // Handle error.
      })
    },
  },
}
</script>
