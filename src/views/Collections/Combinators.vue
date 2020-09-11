<template>
  <b-container fluid>
    <router-view/>
    <table-view-layout v-if="$route.name === 'Combinators'" :rows.sync="rows" :component="component" :limits="limits" :currentPage.sync="currentPage" :perPage.sync="perPage" @change="updatePage" @inputChanged="updateFilter" @deleteConfirmed="deleteItem(itemToDelete, 'Combinators')" @limitUpdated="updateLimit">
      <template v-slot:button>
        <b-button variant="primary" :to="{name: 'Create Combinator' }"><b-icon-plus></b-icon-plus>Add new Combinator</b-button>
      </template>
      <template v-slot:table>
        <b-table v-if="combinators" :filter="filter" :per-page="perPage" :current-page="currentPage" responsive table-variant="light" head-variant="light" :items="combinators" :fields="displayFields" @filtered="updatePagination">
          <template v-slot:cell(description)="row" class="Description">
            <div class="text-wrap" style="width: 300px; max-width: 350px;" v-if="row.item.description">
              {{ shorten(row.item.description) }}
            </div>
          </template>
          <template v-slot:cell(citation)="row" class="citation">
            <div class="text-wrap" style="width: 250px; max-width: 300px;" v-if="row.item.citation">
              {{ shorten(row.item.citation) }}
            </div>
          </template>
          <template v-slot:cell(created_by)="row" class="CreatedBy">
            <div class="w-200 text-truncate" style="max-width: 400px;" v-if="row.item.created_by">
              {{ row.item.created_by.email }}
            </div>
          </template>
          <template v-slot:cell(updated_by)="row" class="UpdatedBy">
            <div class="w-200 text-truncate" style="max-width: 400px;" v-if="row.item.updated_by">
              {{ row.item.updated_by.email }}
            </div>
          </template>
          <template v-slot:cell(actions)="row" class="actions">
            <b-button-group size="sm">
              <b-button :to="{name: 'Update Combinator', params: {id: row.item.id} }" variant="primary" :disabled="row.item.state === 'running'" v-text="'Edit'"></b-button>
              <b-button variant="primary" :disabled="row.item.state === 'running'" v-text="'Delete'" @click="itemToDelete = row.item" v-b-modal.deleteConfirmation></b-button>
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
      component: 'Combinators',
      displayFields: ['actions', 'title', 'description', 'citation', 'created_by', 'updated_by'],
    }
  },
  mixins: [collectionMixin],
  watch: {
    $route(to, from) {
      this.$asyncComputed.combinators.update()
    },
  },
}
</script>
