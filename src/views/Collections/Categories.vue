<template>
  <table-view-layout :rows="rows" :component="component" :limits="limits" :currentPage="currentPage" :perPage="perPage" @change="updatePage" @deleteConfirmed="deleteCategory(itemToDelete)" @limitUpdated="updateLimit">
    <template v-slot:button>
      <b-button variant="primary" :to="{name: 'createCategory', params: {action:'Create', collectionType: 'Categories'} }"><b-icon-plus></b-icon-plus>Add new Category</b-button>
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
          <b-link v-if="row.item" size="sm" class="mb-2" :to="{name: 'editCategory', params: {id: row.item.id, item: row.item, action:'Update', collectionType: 'Categories'} }">
            <b-icon-pencil-square style="padding=50px;"></b-icon-pencil-square>
          </b-link>
          <b-link v-if="row.item" size="sm" class="mb-2" v-b-modal.deleteConfirmation @click="itemToDelete = row.item.id">
            <b-icon-trash></b-icon-trash>
          </b-link>
        </template>
      </b-table>
    </template>
  </table-view-layout>
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
    }
  },
  methods: {
    deleteCategory(id) {
      this.$bvModal.hide('deleteConfirmation')
      let vm = this
      let url = ''
      url = `${this.$baseUrl}/categories/${id}`
      axios
      .delete(url)
      .then((response) => {
        // Handle success.
        vm.$asyncComputed.categories.update()
      })
      .catch((error) => {
        // Handle error.
      })
    },
  },
}
</script>
