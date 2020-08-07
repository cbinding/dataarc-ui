/* eslint-disable indent */
<template>
  <div>
    <b-container>
      <div class="panel panel-default">
        <div class="panel-heading">
          {{ action }}
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
  props: [
    'item',
    'action',
    'collectionType',
  ],
  mixins: [collectionMixin],
  data() {
    return {
      model: {
        type: '',
        action: '',
        title: '',
        description: '',
        citation: '',
        link: '',
        image: {},
        source: {},
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
            label: 'Datasets',
            model: 'datasets',
            values: this.datasets ? this.datasets : ['1', '2'],
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
            label: 'Templates',
            model: 'templates',
            values: this.templates ? this.templates : ['1', '2'],
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
              key: 'title',
              label: 'title',
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
            // validateBeforeSubmit: true,
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
      types: ['Datasets', 'Combinators', 'Map Layers', 'Categories'],
      createUrl: '',
      editUrl: '',
      routeUrl: '',
      errors: [],
    }
  },
  watch: {
    categories: function (val) {
      this.schema.fields.filter((field) => {
        if (field.model && field.model === 'category') {
          field.values = val
        }
      })
    },
    roles: function (val) {
      this.schema.fields.filter((field) => {
        if (field.model && field.model === 'role') {
          field.values = val
        }
      })
    }
  },
  created() {
    this.setData()
  },
  computed: {
    ...mapState('account', ['status'],
      { account: state => state.account,
        users: state => state.users.all,
        user: state => state.users.user,
      }),
  },
  methods: {
    ...mapActions('account', ['addNewUser'], 'users', {
      getAllUsers: 'getAll',
      getById: 'getById',
      deleteUser: 'delete',
    }),
    setData() {
      const vm = this
      // If editing, place old data into model
      if (this.item) {
        this.model = this.item
        this.model.source = null
        if(this.model.category) {
          let temp = this.model.category.id
          this.model.category = temp
        }
      }
      // Set urls used in axios depending on collectionType
      this.setUrl()

      this.model.type = this.collectionType
      this.model.action = this.action
      this.limitFields()

    },
    setUrl() {
      if (this.collectionType === 'Map Layers') {
        if (this.item) {
          this.editUrl = `${this.$baseUrl}/map-layers/${this.item.id}`
        }
        this.routeUrl = '/contributor/maplayers'
      } else if (this.collectionType === 'Combinators') {
        if (this.item) {
          this.editUrl = `${this.$baseUrl}/combinators/${this.item.id}`
        }
        this.routeUrl = '/contributor/combinators'
      } else if (this.collectionType === 'Categories') {
        if (this.item) {
          this.editUrl = `${this.$baseUrl}/categories/${this.item.id}`
        }
        this.routeUrl = '/contributor/categories'
      } else if (this.collectionType === 'Datasets') {
        if (this.item) {
          this.editUrl = `${this.$baseUrl}/datasets/${this.item.id}`
        }
        this.routeUrl = '/contributor/datasets'
      } else if (this.collectionType === 'Users') {
        if (this.item) {
          this.editUrl = `${process.env.VUE_APP_STRAPI_API_URL}/users/${this.item.id}`
        }
        this.routeUrl = '/admin/users'
      }
    },

    deleteItem() {
      const vm = this
      axios
      .delete(this.editUrl)
      .then((response) => {
        // Handle success.
        this.$router.push(this.routeUrl)
      })
      .catch((error) => {
        // Handle error.
      })
    },
    validEmail(email) {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return re.test(email)
    },
    update(val) {
      const vm = this
      this.errors = []
      if (val.type === 'Users') {
        if (!val.username) {
          this.errors.push('Username required.')
        }
        if (!val.email) {
          this.errors.push('Email required.')
        } else if (!this.validEmail(val.email)) {
          this.errors.push('Valid email required.')
        }
        if (!val.password) {
          this.errors.push('Password required.')
        }
      }

      const formData = this.setFormData(val)

      if (this.action === 'Update' && !this.errors.length) {
        axios
        .put(vm.editUrl, formData)
        .then((response) => {
          // Handle success.
          vm.$emit('submit')
          vm.$router.push(vm.routeUrl)
        })
        .catch((error) => {
          // Handle error.
        })
      } else if (val.type === 'Users') {
        if (!this.errors.length) {
          this.addNewUser(formData)
        }
      } else {
        axios
        .post(vm.createUrl, formData)
        .then((response) => {
          // Handle success.
          vm.$emit('submit')
          vm.$router.push(vm.routeUrl)
        })
        .catch((error) => {
          // Handle error.
          console.log('error')
        })
      }
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
