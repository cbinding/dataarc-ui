<template>
  <div>
    <b-container fluid>
      <router-view></router-view>
      <h3>Datasets</h3>
      <div class="d-flex justify-content-end">
        <b-button variant="primary" :to="{name: 'createDataset', params: {action:'Create', collectionType: 'Datasets'} }"><b-icon-plus></b-icon-plus>Add new Dataset</b-button>
      </div>
      <br>
      <b-table v-if="datasets" :responsive="true" table-variant="light" head-variant="light" :items="datasets" :fields="displayFields">
        <template v-slot:cell(description)="row" class="Description">
          <div class="w-200 text-truncate" style="max-width: 400px;" v-if="row.item.description">
            {{ row.item.description }}
          </div>
        </template>
        <template v-slot:cell(actions)="row" class="actions">
          <b-link v-if="row.item" size="sm" class="mb-2" :to="{name: 'editDataset', params: {id: row.item.id, item: row.item, action:'Update', collectionType: 'Datasets'} }">
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
        Are you sure you want to delete this dataset?
      </p>
      <template v-slot:modal-footer="{ ok, cancel }">
        <b-button size="sm" @click="cancel()">
          Cancel
        </b-button>
        <b-button size="sm" variant="danger" @click="deleteDataset(itemToDelete)">
          Delete
        </b-button>
      </template>
    </b-modal>
  </div>
</template>

<script>
import collectionMixin from '../../mixins/collectionMixin'
export default {
  data() {
    return {
      component: 'Datasets',
      displayFields: [
        'id',
        'name',
        'title',
        'description',
        'citation',
        'actions',
      ],
      deleteModal: false,
      itemToDelete: [],
    }
  },
  mixins: [collectionMixin],
  watch: {
    $route(to, from) {
      this.$asyncComputed.datasets.update()
    }
  },
  methods: {
    deleteDataset(id) {
      this.$bvModal.hide('deleteConfirmation')
      let vm = this
      let url = ''
      url = `${this.$baseUrl}/datasets/${id}`
      axios
      .delete(url)
      .then((response) => {
        // Handle success.
        vm.$asyncComputed.datasets.update()
      })
      .catch((error) => {
        // Handle error.
      })
    },
  }
}
</script>
