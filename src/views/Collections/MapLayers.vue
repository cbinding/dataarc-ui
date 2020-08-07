<template>
  <div>
    <b-container fluid>
      <router-view></router-view>
      <h3>Map Layers</h3>
      <div class="d-flex justify-content-end">
        <b-button variant="primary" :to="{name: 'createMapLayer', params: {action:'Create', collectionType: 'Map Layers'} }"><b-icon-plus></b-icon-plus>Add new Map Layer</b-button>
      </div>
      <br>
      <b-table responsive table-variant="light" head-variant="light" :items="mapLayers" :fields="displayFields">
        <template v-slot:cell(actions)="row" class="actions">
          <b-link size="sm" class="mb-2" :to="{name: 'editMapLayer', params: {id: row.item.id, item: row.item, action:'Update', collectionType: 'Map Layers'} }">
            <b-icon-pencil-square style="padding=50px;"></b-icon-pencil-square>
          </b-link>
          <b-link size="sm" class="mb-2" v-b-modal.deleteConfirmation @click="itemToDelete = row.item.id">
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
        Are you sure you want to delete this map layer?
      </p>
      <template v-slot:modal-footer="{ ok, cancel }">
        <b-button size="sm" @click="cancel()">
          Cancel
        </b-button>
        <b-button size="sm" variant="danger" @click="deleteMapLayer(itemToDelete)">
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
      component: 'MapLayers',
      displayFields: ['id', 'name', 'title', 'description', 'actions'],
      deleteModal: false,
      itemToDelete: [],
    }
  },
  mixins: [collectionMixin],
  watch: {
    $route(to, from) {
      this.$asyncComputed.mapLayers.update()
    }
  },
  methods: {
    deleteMapLayer(id) {
      this.$bvModal.hide('deleteConfirmation')
      let vm = this
      let url = ''
      url = `${this.$baseUrl}/map-layers/${id}`
      axios
      .delete(url)
      .then((response) => {
        // Handle success.
        vm.$asyncComputed.mapLayers.update()
      })
      .catch((error) => {
        // Handle error.
      })
    },

  },
}
</script>
