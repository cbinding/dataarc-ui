<template>
  <b-container fluid>
    <router-view />
    <table-view-layout
      :rows="rows"
      :component="component"
      :limits="limits"
      :current-page="currentPage"
      :per-page="perPage"
      @inputChanged="updateFilter"
      @change="updatePage"
      @deleteConfirmed="deleteItem(itemToDelete, 'Categories')"
      @limitUpdated="updateLimit"
    >
      <template v-slot:button>
        <b-button
          variant="primary"
          :to="{name: 'Create Category' }"
        >
          <b-icon-plus />Add new Category
        </b-button>
      </template>
      <template v-slot:table>
        <b-table
          v-if="categories"
          :per-page="perPage"
          :current-page="currentPage"
          :filter="filter"
          responsive
          table-variant="light"
          head-variant="light"
          :items="categories"
          :fields="displayFields"
          @filtered="updatePagination"
        >
          <template
            v-slot:cell(datasets)="datasetRow"
            class="Datasets"
          >
            <ul>
              <div
                v-for="dataset in datasetRow.item.datasets"
                :key="dataset.id"
              >
                <li>
                  {{ dataset.title }}
                </li>
              </div>
            </ul>
          </template>
           <template v-slot:cell(actions)="row" class="actions">
            <b-button-group>
              <router-link :to="{name: 'Update Category', params: {id: row.item.id} }">
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
import TableViewLayout from './templates/TableViewLayout.vue'
export default {
  components: {
    TableViewLayout,
  },
  mixins: [collectionMixin],
  data() {
    return {
      component: 'Categories',
      displayFields: ['name', 'title', 'description', 'color', 'datasets', 'actions'],
    }
  },
  watch: {
    $route(to, from) {
      if (from.name !== 'Categories') {
        this.$apollo.queries.allCategories.refetch()
      }
    },
  },
  created() {
    this.$apollo.queries.allCategories.skip = false
  },
}
</script>
