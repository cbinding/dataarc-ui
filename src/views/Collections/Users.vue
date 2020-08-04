<template>
  <div>
    <b-container fluid>
      <router-view @submit="getAllUsers"></router-view>
      <h3>Users</h3>
      <div class="d-flex justify-content-end">
        <b-button variant="primary" :to="{name: 'createUser', params: {action:'Add new User', collectionType: 'Users', combinators: combinators, roles: roles, datasets: datasets, events: events} }"><b-icon-plus></b-icon-plus>Add new User</b-button>
      </div>
      <br>
      <b-table hover :responsive="true" head-variant="light" :items="users.items" :fields="fields">
        <template v-slot:cell(role)="role" class="Role">
          {{ role.item.role.name }}
        </template>
        <template v-slot:cell(datasets)="datasetRow" class="Datasets">
          <ul>
            <div v-for="dataset in datasetRow.item.datasets" :key="dataset.id">
              <li>
                {{ dataset.name }}
              </li>
            </div>
          </ul>
        </template>
        <template v-slot:cell(events)="eventRow" class="Events">
          <ul>
            <div v-for="event in eventRow.item.events" :key="event.id">
              <li>
                {{ event.name }}
              </li>
            </div>
          </ul>
        </template>
        <template v-slot:cell(combinators)="combinatorRow" class="Combinators">
          <ul>
            <div v-for="combinator in combinatorRow.item.combinators" :key="combinator.id">
              <li>
                {{ combinator.name }}
              </li>
            </div>
          </ul>
        </template>
        <template v-slot:cell(combinator_queries)="combinator_queriesRow" class="CombinatorQueries">
          <ul>
            <div v-for="combinator_queries in combinator_queriesRow.item.combinator_queries" :key="combinator_queries.id">
              <li>
                {{ combinator_queries.name }}
              </li>
            </div>
          </ul>
        </template>
        <template v-slot:cell(dataset_templates)="dataset_templatesRow" class="DatasetTemplates">
          <ul>
            <div v-for="dataset_templates in dataset_templatesRow.item.dataset_templates" :key="dataset_templates.id">
              <li>
                {{ dataset_templates.name }}
              </li>
            </div>
          </ul>
        </template>
        <template v-slot:cell(actions)="row" class="actions">
          <b-link v-if="row.item" size="sm" class="mb-2" :to="{name: 'editUser', params: {id: row.item.id, item: row.item, action:'Update User', collectionType: 'Users'} }">
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
import collectionMixin from '../../mixins/collectionMixin'
import userService from '../../api/user.service'
import { mapState, mapActions } from 'vuex'
export default {
  data() {
    return {
      fields: ['id', 'username', 'email', 'provider', 'confirmed', 'blocked', 'role', 'datasets', 'events', 'combinators', 'combinator_queries', 'dataset_templates', 'actions'],
      deleteModal: false,
      itemToDelete: [],
      combinators: [],
      roles: [],
      datasets: [],
      events: [],
    }
  },
  mixins: [collectionMixin],
  computed: {
    ...mapState({
      account: state => state.account,
      users: state => state.users.all
    })
  },
  created() {
    this.getInitialData()
  },
  methods: {
    ...mapActions('users', {
      getAllUsers: 'getAll',
      deleteUser: 'delete'
    }),
    getInitialData() {
      this.getAllUsers()
      this.getCombinators()
      this.getRoles()
      this.getDatasets()
      this.getEvents()
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
