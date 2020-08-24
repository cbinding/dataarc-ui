<template>
  <b-container v-if="currentDataset" fluid>
    <router-view/>
<!-- Update Dataset -->
    <div class="panel panel-default">
      <div class="panel-heading">
        <h3>Updating: {{ model.title}}</h3>
        <router-link :to="{name: 'Update Templates', params: {id: currentDataset.id}}">Edit Templates</router-link>
      </div>
      <div class="panel-body">
        <vue-form-generator
          :schema="schema"
          :model="model"
          :options="formOptions"
        />
      </div>
    </div>
    <br>
    <b-col sm="2">
      <b-alert
        variant="success"
        dismissible
        fade
        :show="dismissCountDown"
        @dismiss-count-down="countDownChanged"
      >
        Success
      </b-alert>
    </b-col>

<!-- Fields View -->
    <table-view-layout :rows.sync="fieldsCount" component="Fields" :limits.sync="limits" :currentPage.sync="currentPage" :perPage.sync="perPage" @change="updatePage" @limitUpdated="updateLimit">
      <template v-slot:table>
        <b-table v-if="currentDataset" :per-page="perPage" :current-page="currentPage" responsive table-variant="light" head-variant="light" :items="currentDataset.fields" :fields="fieldsList">
          <template v-slot:head(title)="data">
            Display Name (Title)
          </template>
          <template v-slot:head(type)="data">
            Field Type
          </template>
          <template v-slot:cell(title)="row" class="Title">
            <div style="max-width: 400px;" v-if="row.item.title">
              <b-input v-model="row.item.title"></b-input>
            </div>
          </template>
          <template v-slot:cell(type)="row" class="Type">
            <div style="max-width: 400px;" v-if="row.item.type">
              <b-dropdown :text="row.item.type">
                <div v-for="type in fieldTypes" :key="type">
                  <b-dropdown-item v-model="row.item.type" @click="row.item.type = type">
                    {{type}}
                  </b-dropdown-item>
                </div>
              </b-dropdown>
            </div>
          </template>
          <template v-slot:cell(save)="row" class="Save">
            <b-button variant="primary" @click="updateField(row.item)">Save</b-button>
          </template>
        </b-table>
      </template>
    </table-view-layout>
    <br>
    <b-modal hide-backdrop content-class="shadow" centered id="deleteDatasetConfirmation">
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
        <b-button size="sm" variant="danger" @click="deleteItem(model, 'Datasets')">
          Delete
        </b-button>
      </template>
    </b-modal>
    <b-button variant="danger" v-b-modal.deleteDatasetConfirmation>Delete Dataset</b-button>
  </b-container>
</template>

<script>
import gql from 'graphql-tag'
import collectionMixin from '../../mixins/collectionMixin'
export default {
  data() {
    return {
      component: 'Dataset View',
      action: 'Update',
      sortList: ['Path', 'Type'],
      fieldTypes: ['string', 'number', 'boolean', 'array', 'url', 'start_date', 'end_date', 'text_date'],
      fieldsList: [
        'name',
        'title',
        'type',
        'save',
      ],
      fieldsCount: 0,
      dismissSecs: 3,
      dismissCountDown: 0,
      model: {
        type: '',
        action: '',
        title: '',
        description: '',
        citation: '',
        link: '',
        image: null,
        source: null,
        category: '',
      },
      schema: {
        fields: [
          {
            type: 'input',
            inputType: 'text',
            label: 'Title*',
            model: 'title',
            featured: true,
            required: true,
            visible: true,
          },
          {
            type: 'input',
            inputType: 'text',
            label: 'Description',
            model: 'description',
            id: 'description',
            featured: true,
            visible: true,
          },
          {
            type: 'input',
            inputType: 'text',
            label: 'Citation',
            model: 'citation',
            visible: true,
          },
          {
            type: 'input',
            inputType: 'url',
            label: 'Link',
            model: 'link',
            visible: true,
          },
          {
            type: 'upload',
            label: 'Image',
            model: 'image',
            visible: true,
            onChanged(model, schema, event) {
              this.model.image = event.target.files[0]
            },
          },
          {
            type: 'upload',
            label: 'Source',
            model: 'source',
            visible: true,
            required: false,
            onChanged(model, schema, event) {
              this.model.source = event.target.files[0]
            },
          },
          {
            type: 'select',
            values: this.categories ? this.categories : ['1', '2'],
            label: 'Category',
            model: 'category',
            visible: true,
            selectOptions: {
              value: 'id',
              name: 'name',
            },
          },
          {
            type: 'submit',
            buttonText: 'Save',
            inputType: 'submit',
            visible: true,
            onSubmit: this.update,
          },
        ],
      },
      formOptions: {
        validateAfterLoad: true,
        validateAfterChanged: true,
      },
    }
  },
  methods: {
    update(val) {
      this.setFormData(val)
      this.showAlert()
    },
    updateField(val) {
      const temp = []
      temp.fieldType = val.type
      temp.id = val.id
      temp.title = val.title
      temp.type = 'DatasetFields'
      temp.action = 'Update'
      this.setFormData(temp)
      this.showAlert()
    },
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown
    },
    showAlert() {
      this.dismissCountDown = this.dismissSecs
    },
  },
  mixins: [collectionMixin],
  watch: {
    currentDataset(val) {
      if (val) {
        this.model = val
        let temp = this.model.category.id
        this.model.category = temp
        this.model.type = 'Datasets'
        this.model.action = 'Update'
      }
    },
    categories: function(val) {
      if(val) {
        this.schema.fields.filter((field) => {
          if (field.model && field.model === 'category') {
            field.values = val
          }
        })
      }
    }
  },
  mounted() {
    this.currentId = this.$route.params.id
    this.$apollo.queries.dataset.skip = false
    this.$apollo.queries.allCategories.skip = false
  },

}
</script>

<style scoped>
.panel {
	margin-bottom: 20px;
	background-color: #fff;
	border: 1px solid transparent;
	border-radius: 4px;
	-webkit-box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
	box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
	border-color: #ddd;
}

.panel-heading {
	color: #333;
	background-color: #f5f5f5;
	border-color: #ddd;

	padding: 10px 15px;
	border-bottom: 1px solid transparent;
	border-top-left-radius: 3px;
	border-top-right-radius: 3px;
}

.panel-body {
	padding: 15px;
}
</style>
