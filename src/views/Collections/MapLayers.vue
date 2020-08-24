<template>
  <b-container fluid>
    <router-view/>
    <table-view-layout :rows="rows" :component="component" :limits="limits" :currentPage="currentPage" :perPage="perPage" @change="updatePage" @deleteConfirmed="deleteItem(itemToDelete, 'MapLayers')" @limitUpdated="updateLimit">
      <template v-slot:button>
        <b-button variant="primary" :to="{name: 'Create MapLayer' }"><b-icon-plus></b-icon-plus>Add new Map Layer</b-button>
      </template>
      <template v-slot:table>
        <b-table v-if="mapLayers" responsive :per-page="perPage" :current-page="currentPage" table-variant="light" head-variant="light" :items="mapLayers" :fields="displayFields">
          <template v-slot:cell(actions)="row" class="actions">
            <b-link size="sm" class="mb-2" :to="{name: 'Update MapLayer', params: {id: row.item.id} }">
              <b-icon-pencil-square style="padding=50px;"></b-icon-pencil-square>
            </b-link>
            <b-link size="sm" class="mb-2" v-b-modal.deleteConfirmation @click="itemToDelete = row.item">
              <b-icon-trash></b-icon-trash>
            </b-link>
          </template>
        </b-table>
      </template>
    </table-view-layout>
  </b-container>
</template>

<script>
import collectionMixin from '../../mixins/collectionMixin'
export default {
  data() {
    return {
      component: 'MapLayers',
      displayFields: ['id', 'name', 'title', 'description', 'actions'],
    }
  },
  mixins: [collectionMixin],
  created() {
    this.$apollo.queries.allMapLayers.skip = false
  },
  watch: {
    $route(to, from) {
      if (from.name !== 'MapLayers') {
        this.$apollo.queries.allMapLayers.refetch()
      }
    },
  },
}
</script>
