<template>
  <div>
    <b-container>
      <router-view @submit="getCategories"></router-view>
      <h3>Categories</h3>
      <div class="d-flex justify-content-end">
        <b-button variant="primary" :to="{name: 'createCategory', params: {action:'Add new Category', collectionType: 'Categories', datasets: datasets} }"><b-icon-plus></b-icon-plus>Add new Category</b-button>
      </div>
      <br>
      <b-table hover head-variant="light" :items="categories" :fields="fields">
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
          <b-link v-if="row.item" size="sm" class="mb-2" :to="{name: 'editCategory', params: {id: row.item.id, item: row.item, action:'Update Category', collectionType: 'Categories'} }">
            <b-icon-pencil-square style="padding=50px;"></b-icon-pencil-square>
          </b-link>
          <b-link v-if="row.item" size="sm" class="mb-2" v-b-modal.deleteConfirmation @click="itemToDelete = row.item.id">
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
        Are you sure you want to delete this category?
      </p>
      <template v-slot:modal-footer="{ ok, cancel }">
        <b-button size="sm" @click="cancel()">
          Cancel
        </b-button>
        <b-button size="sm" variant="danger" @click="deleteCategory(itemToDelete)">
          Delete
        </b-button>
      </template>
    </b-modal>
  </div>
</template>

<script>
export default {
  data() {
    return {
      categories: [],
      fields: ['id', 'name', 'description', 'color', 'datasets', 'actions'],
      deleteModal: false,
      itemToDelete: [],
      datasets: [],
    }
  },
  created() {
    this.getCategories()
    this.getDatasets()
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
        console.log('success')
        console.log(response)
        vm.getCategories()
      })
      .catch((error) => {
        // Handle error.
        console.log('error')
        console.log(error)
      })
    },
    getCategories() {
      let url = ''
      url = `${this.$baseUrl}/categories`
      axios
      .get(url)
      .then((response) => {
        // Handle success.
        this.categories = response.data
        console.log('success')
        console.log(response)
      })
      .catch((error) => {
        // Handle error.
        console.log('error')
        console.log(error)
      })
    },
    getDatasets() {
      console.log("getting here")
      axios
      .get(`${this.$baseUrl}/datasets`)
      .then((response) => {
        // Handle success.
        console.log('success')
        console.log(response)
        this.datasets = response.data
        console.log(this.datasets)
      })
      .catch((error) => {
        // Handle error.
        console.log('error')
        console.log(error)
      })
    },
  },
}
</script>
