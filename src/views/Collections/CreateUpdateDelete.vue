/* eslint-disable indent */
<template>
  <div>
    <b-container>
      <div class="panel panel-default">
        <div class="panel-heading">
          {{ model.action }} {{ model.title}}
          <br>

        </div>
        <div class="panel-body">
          <p v-if="errors.length">
            <b>Please correct the following error(s):</b>
            <ul>
              <li v-for="error in errors">{{ error }}</li>
            </ul>
          </p>
          <vue-form-generator
            :schema="schema"
            :model="model"
            :options="formOptions"
          />
        </div>
      </div>
    </b-container>
  </div>
</template>

<script>
import collectionMixin from '../../mixins/collectionMixin'
import userService from '../../api/user.service'
import { mapState, mapActions } from 'vuex'
export default {
  mixins: [collectionMixin],
  data() {
    return {
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
        combinator_queries: [],
        dataset_templates: [],
      },
      schema: {
        fields: [
          {
            type: 'input',
            inputType: 'text',
            label: 'Username*',
            model: 'username',
            visible: true,
            required: true,
          },
          {
            type: 'input',
            inputType: 'email',
            label: 'Email*',
            model: 'email',
            visible: true,
            required: true,
          },
          {
            type: 'input',
            inputType: 'password',
            label: 'Password*',
            model: 'password',
            visible: true,
            required: true,
          },
          {
            type: 'input',
            inputType: 'text',
            label: 'Provider',
            model: 'provider',
            visible: true,
          },
          {
            type: 'checkbox',
            label: 'Confirmed',
            model: 'confirmed',
            default: false,
          },
          {
            type: 'checkbox',
            label: 'Blocked',
            model: 'blocked',
            default: false,
          },
          {
            type: 'select',
            values: this.roles ? this.roles : ['1', '2'],
            label: 'Role',
            model: 'role',
            default: false,
          },
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
            type: 'select',
            values: ['AND', 'OR'],
            label: 'Operator',
            model: 'operator',
            default: 'AND',
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
            type: 'select',
            values: this.datasets ? this.datasets : ['1', '2'],
            label: 'Dataset',
            model: 'dataset',
            visible: true,
          },
          {
            type: 'input',
            inputType: 'text',
            label: 'Color',
            model: 'color',
            visible: true,
          },
          {
            type: 'vueMultiSelect',
            multiSelect: true,
            label: 'Queries',
            model: 'queries',
            values: this.queries ? this.queries : ['1', '2'],
            visible: true,
            selectOptions: {
              key: 'field',
              label: 'field',
              multiple: true,
              searchable: true,
              clearOnSelect: true,
              hideSelected: true,
              taggable: true,
              tagPlaceholder: 'tagPlaceholder',
              trackBy: 'field',
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
            type: 'vueMultiSelect',
            multiSelect: true,
            label: 'Concepts',
            model: 'concepts',
            values: this.concepts ? this.concepts : ['1', '2'],
            visible: true,
            selectOptions: {
              key: 'name',
              label: 'name',
              multiple: true,
              searchable: true,
              clearOnSelect: true,
              hideSelected: true,
              taggable: true,
              tagPlaceholder: 'tagPlaceholder',
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
            type: 'vueMultiSelect',
            multiSelect: true,
            label: 'Datasets',
            model: 'datasets',
            values: this.datasets? this.datasets: ['1', '2'],
            visible: true,
            selectOptions: {
              key: 'name',
              label: 'name',
              multiple: true,
              searchable: true,
              clearOnSelect: true,
              hideSelected: true,
              taggable: true,
              tagPlaceholder: 'tagPlaceholder',
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
            type: 'vueMultiSelect',
            multiSelect: true,
            label: 'Events',
            model: 'events',
            values: this.events ? this.events : ['1', '2'],
            visible: true,
            selectOptions: {
              key: 'name',
              label: 'name',
              multiple: true,
              searchable: true,
              clearOnSelect: true,
              hideSelected: true,
              taggable: true,
              tagPlaceholder: 'tagPlaceholder',
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
            type: 'vueMultiSelect',
            multiSelect: true,
            label: 'Combinators',
            model: 'combinators',
            values: this.combinators ? this.combinators : ['1', '2'],
            visible: true,
            selectOptions: {
              key: 'name',
              label: 'name',
              multiple: true,
              searchable: true,
              clearOnSelect: true,
              hideSelected: true,
              taggable: true,
              tagPlaceholder: 'tagPlaceholder',
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
            type: 'vueMultiSelect',
            multiSelect: true,
            label: 'Fields',
            model: 'fields',
            values: this.fields ? this.fields : ['1', '2'],
            visible: true,
            selectOptions: {
              key: 'name',
              label: 'name',
              multiple: true,
              searchable: true,
              clearOnSelect: true,
              hideSelected: true,
              taggable: true,
              trackBy: 'id',
              tagPlaceholder: 'tagPlaceholder',
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
            type: 'vueMultiSelect',
            multiSelect: true,
            label: 'Features',
            model: 'features',
            values: this.features ? this.features : [],
            visible: true,
            selectOptions: {
              key: 'properties.name',
              label: 'properties.name',
              multiple: true,
              searchable: true,
              clearOnSelect: true,
              hideSelected: true,
              taggable: true,
              trackBy: 'id',
              tagPlaceholder: 'tagPlaceholder',
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
            visible: true,
            onSubmit: this.update,
          },
          {
            type: 'submit',
            buttonText: 'Delete',
            inputType: 'submit',
            visible: true,
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
      { account: state => state.account,
        users: state => state.users.all,
        user: state => state.users.user,
      }),
  },
  watch: {
    categories: function (val) {
      this.schema.fields.filter((field) => {
        if (field.model && field.model === 'category') {
          field.values = val
        }
      })
    },
    datasets: function (val) {
      if(val) {
        this.schema.fields.filter((field) => {
          if (field.model && field.model === 'dataset') {
            field.values = val
          }
      })
      }
    },
    roles: function (val) {
      this.schema.fields.filter((field) => {
        if (field.model && field.model === 'role') {
          field.values = val
        }
      })
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
      if (this.$route.name === 'Update Combinator') {
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
          if (vm.model.category) {
            let temp = vm.model.category.id
            vm.model.category = temp
          }
          if (vm.model.dataset) {
            let temp = vm.model.dataset.id
            vm.model.dataset = temp
          }
          if (vm.model.role) {
            let temp = vm.model.role.id
            vm.model.role = temp
          }
          vm.model.type = vm.collectionType
          vm.model.action = vm.action
        })
      }

      this.model.type = this.collectionType
      this.model.action = this.action

      this.limitFields()
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
