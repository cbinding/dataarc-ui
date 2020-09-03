/* eslint-disable indent */
<template>
  <div>
    <b-row>
      <b-overlay :show="currentDataset.id && !features" no-wrap></b-overlay>
      <b-col sm="9">
        <b-container>
          <div class="panel panel-default">
            <div class="panel-heading">
              {{ model.action }} {{ model.title }}
              <br>
            </div>
            <div class="panel-body">
              <p v-if="errors.length">
                <b>Please correct the following error(s):</b>
                <ul>
                  <li v-for="error in errors">
                    {{ error }}
                  </li>
                </ul>
              </p>
              <vue-form-generator
                :schema="schema"
                :model="model"
                :options="formOptions"
                :current-dataset="currentDataset"
              />
            </div>
          </div>
        </b-container>
      </b-col>
      <b-col sm="3" v-if="model && model.type === 'Combinators'">
        <div class="panel panel-default">
          <div class="panel-heading">
            Search Results: {{ filteredFeatures ? filteredFeatures.length : 0 }} out of {{ features ? features.length : 0 }} records
            <br>
            <div v-if="filteredFeatures && filteredFeatures.length > 0">
              Displaying {{ show > filteredFeatures.length ? filteredFeatures.length : show  }} out of {{ filteredFeatures.length }} Results
              <b-link v-if="show < filteredFeatures.length" :disabled="show >= filteredFeatures.length" @click="show += 100">Show More</b-link>
            </div>
          </div>
          <div class="panel-body" style="max-height: 650px; overflow-y: auto;">
            <div v-if="filteredFeatures" v-for="(feature, index) in filteredFeatures.slice(0, show)" :key="feature">
              <ul>
                {{ feature }}
                <b-link v-if="index === (show - 1)" @click="show += 100">
                  <br>
                  Show More...
                </b-link>
              </ul>
            </div>
          </div>
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import collectionMixin from '../../mixins/collectionMixin'

export default {
  mixins: [collectionMixin],
  data() {
    return {
      show: 100,
      item: {},
      model: {
        type: '',
        action: '',
        title: '',
        description: '',
        citation: '',
        link: '',
        image: null,
        source: null,
        user: {},
        category: '',
        username: '',
        email: '',
        password: '',
        provider: '',
        confirmed: false,
        blocked: false,
        role: [],
        fields: [],
        templates: [],
        features: [],
        color: '',
        datasets: [],
        events: [],
        combinators: [],
        queries: [],
        dataset_templates: [],
        operator: 'and',
      },
      schema: {
        fields: [
          {
            type: 'select',
            values: this.datasets ? this.datasets : [''],
            label: 'Dataset',
            model: 'dataset',
            disabled: function(model) {
              return model.action === 'Update'
            },
            visible: function(model) {
              return model.type === 'Combinators'
            },
            selectOptions: {
              name: 'title',
            },
            onChanged(model, schema, event) {
              this.currentId = model.dataset
            },
          },
          {
            type: 'query',
            label: 'Queries',
            model: 'queries',
            values: ['field1', 'field2'],
            visible: function(model) {
              return (model.type === 'Combinators' && model.action === 'Update') || (model.type === 'Combinators' && model.dataset)
            },
            required: true,
            selectOptions: {
              value: 'id',
              path: 'path',
            },
          },
          {
            type: 'select',
            values: [{type: 'And', value: 'and'}, {type: 'Or', value: 'or'}],
            label: 'Operator',
            model: 'operator',
            default: 'and',
            visible: function(model) {
              return (model.type === 'Combinators' && model.action === 'Update') || (model.type === 'Combinators' && model.dataset)
            },
            selectOptions: {
              value: 'value',
              name: 'type',
            }
          },
          {
            type: 'submit',
            buttonText: 'Test Queries',
            inputType: 'submit',
            visible: function(model) {
              return model.type === 'Combinators' && model.dataset && Object.keys(model.queries).length > 0
            },
            onSubmit: this.testQueries,
          },
          {
            type: 'input',
            inputType: 'text',
            label: 'Username*',
            model: 'username',
            visible: function(model) {
              return model.type === 'Users'
            },
            required: true,
          },
          {
            type: 'input',
            inputType: 'email',
            label: 'Email*',
            model: 'email',
            visible: function(model) {
              return model.type === 'Users'
            },
            required: true,
          },
          {
            type: 'input',
            inputType: 'password',
            label: 'Password*',
            model: 'password',
            visible: function(model) {
              return model.type === 'Users'
            },
            required: true,
          },
          {
            type: 'input',
            inputType: 'text',
            label: 'Provider',
            model: 'provider',
            visible: function(model) {
              return model.type === 'Users'
            },
          },
          {
            type: 'checkbox',
            label: 'Confirmed',
            model: 'confirmed',
            default: false,
            visible: function(model) {
              return model.type === 'Users'
            },
          },
          {
            type: 'checkbox',
            label: 'Blocked',
            model: 'blocked',
            default: false,
            visible: function(model) {
              return model.type === 'Users'
            },
          },
          {
            type: 'select',
            values: this.roles ? this.roles : ['1', '2'],
            label: 'Role',
            model: 'role',
            default: false,
            visible: function(model) {
              return model.type === 'Users'
            },
          },
          {
            type: 'input',
            inputType: 'text',
            label: 'Title*',
            model: 'title',
            featured: true,
            required: true,
            visible: function(model) {
              return ((model.type !== 'Combinators' && model.type !== 'Users') || (model.type === 'Combinators' && model.dataset))
            },
          },
          {
            type: 'input',
            inputType: 'text',
            label: 'Description',
            model: 'description',
            id: 'description',
            featured: true,
            visible: function(model) {
              return (model.type === 'Combinators' && model.dataset) || (model.type !== 'Users' && model.type !== 'Combinators' )
            },
            autocomplete: 'off',
          },
          {
            type: 'input',
            inputType: 'text',
            label: 'Citation',
            model: 'citation',
            visible: function(model) {
              return (model.type === 'Combinators' && model.dataset) || model.type === 'Datasets'
            },
            autocomplete: 'off',
          },
          {
            type: 'input',
            inputType: 'url',
            label: 'Link',
            model: 'link',
            visible: function(model) {
              return model.type === 'Datasets'
            },
          },
          {
            type: 'upload',
            label: 'Image',
            model: 'image',
            visible: function(model) {
              return model.type === 'Datasets'
            },
            onChanged(model, schema, event) {
              this.model.image = event.target.files[0]
            },
          },
          {
            type: 'upload',
            label: 'Source',
            model: 'source',
            visible: function(model) {
              return model.type === 'Datasets'
            },
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
            visible: function(model) {
              return model.type === 'Datasets'
            },
            selectOptions: {
              value: 'id',
              name: 'title',
            },
          },
          {
            type: 'input',
            inputType: 'text',
            label: 'Color',
            model: 'color',
            visible: function(model) {
              return model.type === 'Categories'
            },
          },
          {
            type: 'vueMultiSelect',
            multiSelect: true,
            label: 'Concepts',
            model: 'concepts',
            values: this.concepts ? this.concepts : ['1', '2'],
            visible: function(model) {
              return (model.type === 'Combinators' && model.action === 'Update') || (model.type === 'Combinators' && model.dataset)
            },
            selectOptions: {
              key: 'title',
              label: 'title',
              multiple: true,
              searchable: true,
              clearOnSelect: true,
              hideSelected: true,
              trackBy: 'id',
              onNewTag(newTag, id, options, value) {
                options.push(newTag)
                value.push(newTag)
              },
            },
            onChanged(model, newVal, oldVal, field) {
              model = newVal
            },
          },
          {
            type: 'submit',
            buttonText: 'Submit',
            inputType: 'submit',
            visible: function(model) {
              return model.type !== 'Combinators' || model.dataset
            },
            onSubmit: this.update,
          },
          {
            type: 'submit',
            buttonText: 'Delete',
            inputType: 'submit',
            visible: function(model) {
              return model.action === 'Update'
            },
            onSubmit: this.deleteItem,
          },
        ],
      },
      formOptions: {
        validateAfterLoad: true,
        validateAfterChanged: true,
      },
      types: ['Datasets', 'Combinators', 'MapLayers', 'Categories'],
      createUrl: '',
      editUrl: '',
      routeUrl: '',
      errors: [],
      action: '',
      collectionType: '',
    }
  },
  computed: {
    ...mapState('account', ['status'],
      {
        account: (state) => state.account,
        users: (state) => state.users.all,
        user: (state) => state.users.user,
      }),
  },
  watch: {
    categories(val) {
      this.schema.fields.filter((field) => {
        if(field.model && field.model === 'category') {
          field.values = val
        }
      })
    },
    datasets(val) {
      if (val) {
        this.schema.fields.filter((field) => {
          if(field.model && field.model === 'dataset') {
            field.values = val
          }
        })
      }
    },
    roles(val) {
      this.schema.fields.filter((field) => {
        if(field.model && field.model === 'role') {
          field.values = val
        }
      })
    },
    model: {
      handler(newVal, oldVal) {
        if (newVal.dataset && newVal.dataset !== this.currentId) {
          this.features = null
          this.currentId = newVal.dataset
          this.$apollo.queries.dataset.skip = false
        }
      },
      deep: true,
    },
    currentDataset(val) {
      if (val) {
        this.schema.fields.filter((field) => {
          if (field.model && field.model === 'queries') {
            field.values = val.fields
          }
        })
      }
    },
  },
  mounted() {
    this.setData()
  },
  methods: {
    ...mapActions('account', ['addNewUser'], 'users', {
      getAllUsers: 'getAll',
      getById: 'getById',
      deleteUser: 'delete',
    }),
    setData() {
      const variables = this.$route.name.split(' ')
      const pathArray = this.$route.path.split('/')
      this.action = variables[0]
      this.collectionType = (variables[1] !== 'Category' ? `${variables[1]}s` : 'Categories')
      if (this.$route.name === 'Update Combinator' || 'Create Combinator') {
        this.$apollo.queries.allDatasets.skip = false
      }
      if (this.$route.name === 'Create Dataset') {
        this.$apollo.queries.allCategories.skip = false
      }

      if (this.action === 'Update' && this.collectionType !== 'Datasets') {
        this.editUrl = `${pathArray[2]}/${this.$route.params.id}`
        const vm = this
        this.getSingle(this.editUrl).then((value) => {
          vm.item = value.data
          vm.model = vm.item
          vm.model.image = null
          vm.model.source = null
          if(vm.model.operator !== 'and' && vm.model.operator !== 'or') {
            vm.model.operator = 'and'
          }
          if (vm.model.category) {
            const temp = vm.model.category.id
            vm.model.category = temp
          }
          if (vm.model.dataset) {
            const temp = vm.model.dataset.id
            vm.model.dataset = temp
          }
          if (vm.model.role) {
            const temp = vm.model.role.id
            vm.model.role = temp
          }
          vm.model.type = vm.collectionType
          vm.model.action = vm.action
        })
      }

      this.model.type = this.collectionType
      this.model.action = this.action
    },
    update(val) {
      val.type = this.model.type
      val.action = this.model.action
      this.setFormData(val)
    },
  },
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

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
