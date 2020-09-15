<template>
  <b-container fluid>
    <router-view />
    <table-view-layout
      v-if="$route.name === 'TemporalCoverages'"
      :rows="rows"
      :component="component"
      :limits="limits"
      :current-page="currentPage"
      :per-page="perPage"
      @inputChanged="updateFilter"
      @change="updatePage"
      @deleteConfirmed="deleteItem(itemToDelete, 'TemporalCoverages')"
      @limitUpdated="updateLimit"
    >
      <template v-slot:button>
        <b-button
          variant="primary"
          :to="{name: 'Create Temporal Coverage' }"
        >
          <b-icon-plus />Add new Temporal Coverage
        </b-button>
      </template>
      <template v-slot:table>
        <b-table
          v-if="temporalCoverages"
          :per-page="perPage"
          :current-page="currentPage"
          :filter="filter"
          responsive
          fixed
          table-variant="light"
          head-variant="light"
          :items="temporalCoverages"
          :fields="displayFields"
          @filtered="updatePagination"
        >
          <template v-slot:cell(title)="row" class="Title">
            <div class="text-wrap" style="width: 200px; max-width: 200px;" v-if="row.item.title">
              {{ row.item.title }}
            </div>
          </template>
          <template v-slot:cell(description)="row" class="Description">
            <div class="text-wrap" style="width: 400px; max-width: 450px;" v-if="row.item.description">
              {{ shorten(row.item.description) }}
            </div>
          </template>
          <template v-slot:cell(actions)="row" class="actions">
            <b-button-group>
              <router-link :to="{name: 'Update Temporal Coverage', params: {id: row.item.id} }">
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
  mixins: [collectionMixin],
  data() {
    return {
      component: 'TemporalCoverages',
      displayFields: ['actions', 'title', 'description', 'citation', 'url', 'start_date', 'end_date'],
    }
  },
  watch: {
    $route(to, from) {
      if (from.name !== 'TemporalCoverages') {
        this.$apollo.queries.allTemporalCoverages.refetch()
      }
    },
  },
  created() {
    this.$apollo.queries.allTemporalCoverages.skip = false
  },
}
</script>
