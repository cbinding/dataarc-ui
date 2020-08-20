<template>
  <b-container fluid>
    <router-view/>
    <table-view-layout :rows="rows" :component="component" :limits="limits" :currentPage="currentPage" :perPage="perPage" @change="updatePage" @deleteConfirmed="deleteItem(itemToDelete, 'Categories')" @limitUpdated="updateLimit">
      <template v-slot:button>
        <b-button variant="primary" :to="{name: 'Create Category' }"><b-icon-plus></b-icon-plus>Add new Category</b-button>
      </template>
      <template v-slot:table>
        <b-table v-if="categories" :responsive="true" table-variant="light" head-variant="light" :items="categories" :fields="displayFields">
          <template v-slot:cell(datasets)="datasetRow" class="Datasets">
            <ul>
              <div v-for="dataset in datasetRow.item.datasets" :key="dataset.id">
                <li>
                  {{ dataset.name }}
                </li>
              </div>
            </ul>
          </template>
          <template v-slot:cell(actions)="row" class="actions">
            <b-link v-if="row.item" size="sm" class="mb-2" :to="{name: 'Update Category', params: {id: row.item.id} }">
              <b-icon-pencil-square style="padding=50px;"></b-icon-pencil-square>
            </b-link>
            <b-link v-if="row.item" size="sm" class="mb-2" v-b-modal.deleteConfirmation @click="itemToDelete = row.item">
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
import TableViewLayout from './templates/TableViewLayout.vue'
export default {
  components: {
    TableViewLayout,
  },
  data() {
    return {
      component: 'Categories',
      displayFields: ['id', 'name', 'title', 'description', 'color', 'datasets', 'actions'],
    }
  },
  mixins: [collectionMixin],
  watch: {
    $route(to, from) {
      this.$asyncComputed.categories.update()
    },
  },
}
</script>
