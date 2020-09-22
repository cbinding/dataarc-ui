<template>
  <b-container fluid>
    <router-view />
    <table-view-layout
      v-if="$route.name === 'MapLayers'"
      :rows="rows"
      :component="component"
      :limits="limits"
      :currentPage="currentPage"
      :perPage="perPage"
      @inputChanged="updateFilter"
      @change="updatePage"
      @deleteConfirmed="deleteItem(itemToDelete, 'MapLayers')"
      @limitUpdated="updateLimit"
    >
      <template v-slot:button>
        <b-button variant="primary" :to="{ name: 'Create MapLayer' }"><b-icon-plus></b-icon-plus>Add new Map Layer</b-button>
      </template>
      <template v-slot:table>
        <b-table
          v-if="mapLayers"
          ref="mapLayers"
          id="mapLayers"
          responsive
          :filter="filter"
          :per-page="perPage"
          :current-page="currentPage"
          table-variant="light"
          head-variant="light"
          :items="mapLayers"
          :fields="displayFields"
          @filtered="updatePagination"
        >
          <template v-slot:cell(actions)="row" class="actions">
            <b-button-group size="sm">
              <b-button :to="{ name: 'Update MapLayer', params: { id: row.item.id } }" variant="primary" v-text="'Edit'"></b-button>
              <b-button variant="primary" v-text="'Delete'" @click="itemToDelete = row.item" v-b-modal.deleteConfirmation></b-button>
            </b-button-group>
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
      displayFields: ['actions', 'name', 'title', 'description'],
    }
  },
  mixins: [collectionMixin],
  created() {
    this.$apollo.queries.allMapLayers.skip = false
  },
  watch: {
    $route(to, from) {
      if (to.name !== 'MapLayers') {
        this.$apollo.queries.allMapLayers.skip = true
      } else if (from.name !== 'MapLayers') {
        this.$apollo.queries.allMapLayers.skip = false
        this.$apollo.queries.allMapLayers.refetch()
      }
    },
  },
}
</script>
