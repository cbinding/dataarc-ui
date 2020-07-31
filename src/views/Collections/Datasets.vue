<template>
  <div>
    <b-container>
      <router-view @submit="getDatasets"></router-view>
      <h3>Datasets</h3>
      <div class="d-flex justify-content-end">
        <b-button variant="primary" :to="{name: 'createDataset', params: {action:'Add new Dataset', collectionType: 'Datasets', datasets: datasets, categories: categories, combinators: combinators, fields: fields, templates: templates, features: features} }"><b-icon-plus></b-icon-plus>Add new Dataset</b-button>
      </div>
      <br>
      <b-table :responsive="true" head-variant="light" :items="datasets" :fields="tableFields">
        <template v-slot:cell(category)="categoryRow" class="Category">
          {{ categoryRow.item.category.name }}
        </template>
        <template v-slot:cell(combinators)="combinatorsRow" class="Combinators">
          <ul>
            <div v-for="combinator in combinatorsRow.item.combinators" :key="combinator.id">
              <li>
                {{ combinator.name }}
              </li>
            </div>
          </ul>
        </template>
        <template v-slot:cell(fields)="fieldsRow" class="Fields">
          <ul>
            <div v-for="field in fieldsRow.item.fields" :key="field.id">
              <li>
                {{ field.name }}
              </li>
            </div>
          </ul>
        </template>
        <template v-slot:cell(templates)="templatesRow" class="Templates">
          <ul>
            <div v-for="template in templatesRow.item.templates" :key="template.id">
              <li>
                {{ template.name }}
              </li>
            </div>
          </ul>
        </template>
        <template v-slot:cell(features)="featuresRow" class="Features">
          <ul>
            <div v-for="feature in featuresRow.item.features" :key="feature.id">
              <li>
                {{ feature.title }}
              </li>
            </div>
          </ul>
        </template>
        <template v-slot:cell(actions)="row" class="actions">
          <b-link v-if="row.item" size="sm" class="mb-2" :to="{name: 'editDataset', params: {id: row.item.id, item: row.item, action:'Update Dataset', collectionType: 'Datasets', datasets: datasets, categories: categories, combinators: combinators, fields: fields, templates: templates, features: features} }">
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
        Are you sure you want to delete this dataset?
      </p>
      <template v-slot:modal-footer="{ ok, cancel }">
        <b-button size="sm" @click="cancel()">
          Cancel
        </b-button>
        <b-button size="sm" variant="danger" @click="deleteDataset(itemToDelete)">
          Delete
        </b-button>
      </template>
    </b-modal>
  </div>
</template>

<script>
import collectionMixin from '../../mixins/collectionMixin'
export default {
  data() {
    return {
      datasets: [],
      tableFields: [
        'id',
        'name',
        'description',
        'citation',
        'link',
        'image',
        'file',
        'category',
        'combinators',
        'fields',
        'templates',
        'features',
        'actions'
        ],
      deleteModal: false,
      itemToDelete: [],
      categories: [],
      combinators: [],
      fields: [],
      templates: [],
      features: [],
    }
  },
  mixins: [collectionMixin],
  created() {
    this.getInitialData()
  },
  methods: {
    getInitialData() {
      this.getDatasets()
      this.getCategories()
      this.getCombinators()
      this.getFields()
      this.getTemplates()
      this.getFeatures()
    },
    deleteDataset(id) {
      this.$bvModal.hide('deleteConfirmation')
      let vm = this
      let url = ''
      url = `${this.$baseUrl}/datasets/${id}`
      axios
      .delete(url)
      .then((response) => {
        // Handle success.
        vm.getDatasets()
      })
      .catch((error) => {
        // Handle error.
      })
    },
  }
}
</script>
