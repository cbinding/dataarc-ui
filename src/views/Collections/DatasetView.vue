<template>
  <b-container v-if="currentDataset" fluid>
    <router-view/>
<!-- Update Dataset -->
    <div class="panel panel-default">
      <div class="panel-heading">
        <h3>Updating: {{ model.title}}</h3>
        <router-link v-if="currentDataset" :to="{name: 'Update Templates'}">Edit Templates</router-link>
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
    <table-view-layout :rows.sync="fieldsCount" component="Fields" :limits.sync="limits" :currentPage.sync="currentFieldsPage" @inputChanged="updateFilter" :perPage.sync="currentFieldsLimit" @change="updatePage" @limitUpdated="updateLimit">
      <template v-slot:table>
        <b-table v-if="currentDataset" :filter="filterFields" :per-page="currentFieldsLimit" :current-page="currentFieldsPage" responsive table-variant="light" head-variant="light" :items="currentDataset.fields" :fields="fieldsList" @filtered="updatePagination">
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
          <template v-slot:cell(state)="row" class="state">
            <div>
              <b-badge :variant="status(row.item.state)">
                {{ row.item.state ? row.item.state : 'pending' }}
              </b-badge>
            </div>
          </template>
          <template v-slot:cell(state_at)="row" class="state_at">
            <div>
              {{ getDate(row.item.state_at) }}
            </div>
          </template>
          <template v-slot:cell(save)="row" class="Save">
            <b-button variant="primary" @click="updateField(row.item)">Save</b-button>
          </template>
        </b-table>
      </template>
    </table-view-layout>
    <br>
<!-- Combinators View -->
    <table-view-layout :rows.sync="combinatorsCount" component="Combinators" :limits.sync="limits" :currentPage.sync="currentCombinatorsPage" :perPage.sync="currentCombinatorsLimit" @inputChanged="updateFilter" @change="updatePage" @limitUpdated="updateLimit">
      <template v-slot:table>
        <b-table v-if="currentDataset" :filter="filterCombinators" :per-page="currentCombinatorsLimit" :current-page="currentCombinatorsPage" responsive table-variant="light" head-variant="light" :items="currentDataset.combinators" :fields="combinatorsList" @filtered="updatePagination">
          <template v-slot:head(title)="data">
            Display Name (Title)
          </template>
          <template v-slot:head(type)="data">
            Field Type
          </template>
          <template v-slot:cell(title)="row" class="Title">
            <div style="max-width: 400px;" v-if="row.item.title">
              {{ row.item.title }}
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
          <template v-slot:cell(state)="row" class="state">
            <div>
              <b-badge :variant="status(row.item.state)">
                {{ row.item.state ? row.item.state : 'pending' }}
              </b-badge>
            </div>
          </template>
          <template v-slot:cell(state_at)="row" class="state_at">
            <div>
              {{ getDate(row.item.state_at) }}
            </div>
          </template>
          <template v-slot:cell(actions)="row" class="Actions">
            <router-link :to="{name: 'Update Combinator', params: {id: row.item.id} }">
              <b-button variant="primary">Edit</b-button>
            </router-link>
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
        'source',
        'title',
        'type',
        'state',
        'state_msg',
        'state_at',
        'save',
      ],
      combinatorsList: [
        'name',
        'title',
        'description',
        'citation',
        'state',
        'state_msg',
        'state_at',
        'actions',
      ],
      filterFields: '',
      filterCombinators: '',
      fieldsCount: 0,
      combinatorsCount: 0,
      dismissSecs: 3,
      pending: 'warning',
      missing: 'danger',
      done: 'success',
      dismissCountDown: 0,
      model: {
        type: '',
        action: '',
        title: '',
        description: '',
        citation: '',
        url: '',
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
            label: 'Url',
            model: 'url',
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
    },
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown
    },
    showAlert() {
      this.dismissCountDown = this.dismissSecs
    },
    status(val) {
      if (val) {
        return this[val]
      }
      return 'secondary'
    },
  },
  mixins: [collectionMixin],
  watch: {
    currentDataset(val) {
      if (val) {
        this.model = val
        if(this.model.category && this.model.category.id) {
          let temp = this.model.category.id
          this.model.category = temp
        }
        this.model.type = 'Datasets'
        this.model.action = 'Update'
      }
    },
    categories(val) {
      if (val) {
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

<style>
.form-control {
  padding-top: 0.35rem;
}

.table td {
  padding: 0.4rem;
  padding-right: 0rem;
}

.btn-sm, .btn-group-sm > .btn{
  padding: 0.3rem;
}
</style>
