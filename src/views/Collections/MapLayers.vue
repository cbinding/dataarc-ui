<template>
  <table-view-layout :rows="rows" :component="component" :limits="limits" :currentPage="currentPage" :perPage="perPage" @change="updatePage" @deleteConfirmed="deleteItem(itemToDelete, 'map-layers')" @limitUpdated="updateLimit">
    <template v-slot:button>
      <b-button variant="primary" :to="{name: 'createMapLayer', params: {action:'Create', collectionType: 'Map Layers'} }"><b-icon-plus></b-icon-plus>Add new Map Layer</b-button>
    </template>
    <template v-slot:table>
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
    </template>
  </table-view-layout>
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
  watch: {
    $route(to, from) {
      this.$asyncComputed.mapLayers.update()
    }
  },
}
</script>
