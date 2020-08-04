/* eslint-disable indent */
<template>
  <div>
    <b-container>
      <div class="panel panel-default">
        <div class="panel-heading">
          {{ action }}
        </div>
        <div class="panel-body">
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
export default {
  props: [
    'item',
    'action',
    'collectionType',
    'datasets',
    'categories',
    'combinators',
    'fields',
    'templates',
    'features',
    'events',
    'schema'
    ],
    mixins: [collectionMixin],
  data() {
    return {
      model: {
        type: '',
        action: '',
        name: '',
        description: '',
        citation: '',
        link: '',
        image: {},
        file: {},
        user: {},
        category: {},
        username: '',
        email: '',
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
      // schema: {
      //   fields: [
      //     {
      //       type: 'input',
      //       inputType: 'text',
      //       label: 'Name*',
      //       model: 'name',
      //       featured: true,
      //       required: true,
      //       visible: true,
      //     },
      //     {
      //       type: 'input',
      //       inputType: 'text',
      //       label: 'Description',
      //       model: 'description',
      //       id: 'description',
      //       featured: true,
      //       visible: true,
      //     },
      //     {
      //       type: 'input',
      //       inputType: 'text',
      //       label: 'Citation',
      //       model: 'citation',
      //       visible: true,
      //     },
      //     {
      //       type: 'input',
      //       inputType: 'url',
      //       label: 'Link',
      //       model: 'link',
      //       visible: true,
      //     },
      //     {
      //       type: 'upload',
      //       label: 'Image',
      //       model: 'image',
      //       visible: true,
      //       onChanged(model, schema, event) {
      //         this.model.image = event.target.files[0]
      //       },
      //     },
      //     {
      //       type: 'upload',
      //       label: 'File',
      //       model: 'file',
      //       visible: true,
      //       required: false,
      //       onChanged(model, schema, event) {
      //         this.model.file = event.target.files[0]
      //       },
      //     },
      //     {
      //       type: 'select',
      //       values: this.categories,
      //       label: 'Category',
      //       model: 'category',
      //       visible: true,
      //     },
      //     {
      //       type: 'input',
      //       inputType: 'text',
      //       label: 'Color',
      //       model: 'color',
      //       visible: true,
      //     },
      //     {
      //       type: 'vueMultiSelect',
      //       multiSelect: true,
      //       label: 'Datasets',
      //       model: 'datasets',
      //       values: this.datasets,
      //       visible: true,
      //       selectOptions: {
      //         key: 'name',
      //         label: 'name',
      //         multiple: true,
      //         searchable: true,
      //         clearOnSelect: true,
      //         hideSelected: true,
      //         taggable: true,
      //         tagPlaceholder: 'tagPlaceholder',
      //         trackBy: 'id',
      //         onNewTag(newTag, id, options, value) {
      //           options.push(newTag)
      //           value.push(newTag)
      //         },
      //       },
      //       onChanged(model, newVal, oldVal, field) {
      //         model = newVal
      //       },
      //     },
      //     {
      //       type: 'vueMultiSelect',
      //       multiSelect: true,
      //       label: 'Events',
      //       model: 'events',
      //       values: this.events,
      //       visible: true,
      //       selectOptions: {
      //         key: 'name',
      //         label: 'name',
      //         multiple: true,
      //         searchable: true,
      //         clearOnSelect: true,
      //         hideSelected: true,
      //         taggable: true,
      //         tagPlaceholder: 'tagPlaceholder',
      //         trackBy: 'id',
      //         onNewTag(newTag, id, options, value) {
      //           options.push(newTag)
      //           value.push(newTag)
      //         },
      //       },
      //       onChanged(model, newVal, oldVal, field) {
      //         model = newVal
      //       },
      //     },
      //     {
      //       type: 'vueMultiSelect',
      //       multiSelect: true,
      //       label: 'Combinators',
      //       model: 'combinators',
      //       values: this.combinators,
      //       visible: true,
      //       selectOptions: {
      //         key: 'name',
      //         label: 'name',
      //         multiple: true,
      //         searchable: true,
      //         clearOnSelect: true,
      //         hideSelected: true,
      //         taggable: true,
      //         tagPlaceholder: 'tagPlaceholder',
      //         trackBy: 'id',
      //         onNewTag(newTag, id, options, value) {
      //           options.push(newTag)
      //           value.push(newTag)
      //         },
      //       },
      //       onChanged(model, newVal, oldVal, field) {
      //         model = newVal
      //       },
      //     },
      //     {
      //       type: 'vueMultiSelect',
      //       multiSelect: true,
      //       label: 'Fields',
      //       model: 'fields',
      //       values: this.fields,
      //       visible: true,
      //       selectOptions: {
      //         key: 'name',
      //         label: 'name',
      //         multiple: true,
      //         searchable: true,
      //         clearOnSelect: true,
      //         hideSelected: true,
      //         taggable: true,
      //         trackBy: 'id',
      //         tagPlaceholder: 'tagPlaceholder',
      //         onNewTag(newTag, id, options, value) {
      //           options.push(newTag)
      //           value.push(newTag)
      //         },
      //       },
      //       onChanged(model, newVal, oldVal, field) {
      //         model = newVal
      //       },
      //     },
      //     {
      //       type: 'vueMultiSelect',
      //       multiSelect: true,
      //       label: 'Templates',
      //       model: 'templates',
      //       values: this.templates,
      //       visible: true,
      //       selectOptions: {
      //         key: 'name',
      //         label: 'name',
      //         multiple: true,
      //         searchable: true,
      //         clearOnSelect: true,
      //         hideSelected: true,
      //         taggable: true,
      //         trackBy: 'id',
      //         tagPlaceholder: 'tagPlaceholder',
      //         onNewTag(newTag, id, options, value) {
      //           options.push(newTag)
      //           value.push(newTag)
      //         },
      //       },
      //       onChanged(model, newVal, oldVal, field) {
      //         model = newVal
      //       },
      //     },
      //     {
      //       type: 'vueMultiSelect',
      //       multiSelect: true,
      //       label: 'Features',
      //       model: 'features',
      //       values: this.features,
      //       visible: true,
      //       selectOptions: {
      //         key: 'title',
      //         label: 'title',
      //         multiple: true,
      //         searchable: true,
      //         clearOnSelect: true,
      //         hideSelected: true,
      //         taggable: true,
      //         trackBy: 'id',
      //         tagPlaceholder: 'tagPlaceholder',
      //         onNewTag(newTag, id, options, value) {
      //           options.push(newTag)
      //           value.push(newTag)
      //         },
      //       },
      //       onChanged(model, newVal, oldVal, field) {
      //         model = newVal
      //       },
      //     },
      //     {
      //       type: 'submit',
      //       buttonText: 'Submit',
      //       inputType: 'submit',
      //       visible: true,
      //       onSubmit: this.update,
      //     },
      //     {
      //       type: 'submit',
      //       buttonText: 'Delete',
      //       inputType: 'submit',
      //       visible: true,
      //       onSubmit: this.deleteItem,
      //     },
      //   ],
      // },
      formOptions: {
        validateAfterLoad: true,
        validateAfterChanged: true,
      },
      types: ['Datasets', 'Combinators', 'Map Layers', 'Categories'],
      category: ['Textual', 'Archaeological', 'Environmental'],
      createUrl: '',
      editUrl: '',
      routeUrl: '',
      _roles: this.roles,
    }
  },
  // asyncComputed: {
  //   async roles() {
  //     console.log("getting here")
  //     // if (this._roles.length > 0) return this._roles
  //     const response = await this.getSource('users-permissions/roles', 'roles')
  //     // .then((roles) => {
  //     //   // console.log(roles)
  //     //   this._roles = roles
  //     //   console.log(this._roles)
  //     //   return this._roles
  //     // })
  //     this._roles = response
  //     return this._roles
  //   },
  // },
  created() {
    this.setData()
  },
  methods: {
    setData() {
      const vm = this
      // If editing, place old data into model
      if (this.item) {
        this.model = this.item
        this.model.file = null
        let temp = this.model.category.id
        this.model.category = temp
      }
      // Set urls used in axios depending on collectionType
      this.setUrl()

      this.model.type = this.collectionType
      this.model.action = this.action

      // Keep basic fields for all forms
      this.schema.fields.forEach((field) => {
        if (field.buttonText === 'Submit' || field.model === 'name' || field.model === 'description' || field.buttonText === 'Delete') {
          // If adding a new **, hide Delete button
          if (field.buttonText === 'Delete' && (this.action === 'Add new Map Layer' || this.action === 'Add new Category' || this.action === 'Add new Dataset' || this.action === 'Add new User')) {
            field.visible = false
          } else if (this.collectionType === 'Users' && (field.model === 'name' || field.model === 'description')) {
            field.visible = false
          } else {
            return
          }
        }
        // Limit fields depending on collectionType
        if (this.collectionType === 'Map Layers') {
          if (field.model !== 'file') {
            field.visible = false
          }
        }
        if (this.collectionType === 'Combinators') {
          if (field.model !== 'citation') {
            field.visible = false
          }
        }
        if (this.collectionType === 'Categories') {
          if (field.model !== 'color' && field.model !== 'datasets') {
            field.visible = false
          }
        }
        if (this.collectionType === 'Datasets') {
          if (
            field.model !== 'citation'
						&& field.model !== 'link'
						&& field.model !== 'image'
						&& field.model !== 'file'
						&& field.model !== 'category'
						&& field.model !== 'combinators'
						&& field.model !== 'fields'
						&& field.model !== 'templates'
						&& field.model !== 'features'
          ) {
            field.visible = false
          }
        }
        if (this.collectionType === 'Users') {
          if (
            field.model !== 'username'
            && field.model !== 'email'
            && field.model !== 'provider'
            && field.model !== 'confirmed'
            && field.model !== 'blocked'
            && field.model !== 'role'
            && field.model !== 'datasets'
            && field.model !== 'events'
            && field.model !== 'combinators'
            && field.model !== 'combinator_queries'
            && field.model !== 'dataset_templates'
            ) {
            field.visible = false
          }
        }
      })
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
    update() {
      const formData = new FormData()
      const data = {}
      if (this.model.type === 'Map Layers') {
        this.createUrl = `${this.$baseUrl}/map-layers`
        data.name = this.model.name
        data.description = this.model.description
        if (this.model.file) {
          formData.append('files.file', this.model.file, this.model.file.name)
        }
      } else if (this.model.type === 'Combinators') {
        this.createUrl = `${this.$baseUrl}/combinators`
        data.name = this.model.name
        data.description = this.model.description
        data.citation = this.model.citation
      } else if (this.model.type === 'Categories') {
        this.createUrl = `${this.$baseUrl}/categories`
        data.name = this.model.name
        data.description = this.model.description
        data.color = this.model.color
      } else if (this.model.type === 'Datasets') {
        this.createUrl = `${this.$baseUrl}/datasets`
        data.name = this.model.name
        data.description = this.model.description
        data.citation = this.model.citation
        data.link = this.model.link
        data.image = this.model.image
        if (this.model.file && this.model.file.length > 0) {
          data.file = this.model.file
        }
        const temp = this.categories.filter((category) => {
          if (category.id === this.model.category) {
            return category
          }
        })
        data.category = temp[0]
        data.combinators = this.model.combinators
        data.fields = this.model.fields
        data.templates = this.model.templates
        data.features = this.model.features
      }

      formData.append('data', JSON.stringify(data))
      if (this.action === 'Update Map Layer' || this.action === 'Update Category' || this.action === 'Update Dataset') {
        axios
        .put(this.editUrl, formData)
        .then((response) => {
          // Handle success.
          this.$emit('submit')
          this.$router.push(this.routeUrl)
        })
        .catch((error) => {
          // Handle error.
        })
      } else {
        axios
        .post(this.createUrl, formData)
        .then((response) => {
          // Handle success.
          this.$emit('submit')
          this.$router.push(this.routeUrl)
        })
        .catch((error) => {
          // Handle error.
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
