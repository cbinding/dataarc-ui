<template>
  <b-container fluid>
    <router-view/>
    <table-view-layout v-if="$route.name === 'MapLayers'" :rows="rows" :component="component" :limits="limits" :currentPage="currentPage" :perPage="perPage" @inputChanged="updateFilter" @change="updatePage" @deleteConfirmed="deleteItem(itemToDelete, 'MapLayers')" @limitUpdated="updateLimit">
      <template v-slot:button>
        <b-button variant="primary" :to="{name: 'Create MapLayer' }"><b-icon-plus></b-icon-plus>Add new Map Layer</b-button>
      </template>
      <template v-slot:table>
        <b-table v-if="mapLayers" responsive :filter="filter" :per-page="perPage" :current-page="currentPage" table-variant="light" head-variant="light" :items="mapLayers" :fields="displayFields" @filtered="updatePagination">
          <template v-slot:cell(actions)="row" class="actions">
            <b-button-group>
              <router-link :to="{name: 'Update MapLayer', params: {id: row.item.id} }">
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
import collectionMixin from '../../mixins/collectionMixin'
export default {
  data() {
    return {
      component: 'MapLayers',
      displayFields: ['name', 'title', 'description', 'actions'],
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
