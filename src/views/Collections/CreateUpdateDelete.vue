<template>
  <div>
    <b-container>
      <div class="panel panel-default">
        <div class="panel-heading">{{action}}</div>
        <div class="panel-body">
          <vue-form-generator :schema="schema" :model="model" :options="formOptions"></vue-form-generator>
        </div>
      </div>
    </b-container>
  </div>
</template>

<script>
export default {
  props: ['item', 'action', 'collectionType', 'datasets'],
  data() {
    return {
      model: {
        type: '',
        action: '',
        name: '',
        description: '',
        citation: '',
        link: '',
        file: null,
        category: '',
        color: '',
        datasets: [],
      },
      schema: {
        fields: [
          {
            type: 'input',
            inputType: 'text',
            label: 'Name*',
            model: 'name',
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
            label: 'File',
            model: 'file',
            visible: true,
            required: false,
            onChanged(model, schema, event) {
              this.model.file = event.target.files[0]
            },
          },
          {
            type: 'input',
            inputType: 'text',
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
            values: this.datasets,
            visible: true,
            selectOptions: {
              key: 'name',
              label: 'name',
              multiple: true,
              searchable: true,
              clearOnSelect: true,
              hideSelected: true,
              taggable: true,
              tagPlaceholder: "tagPlaceholder",
              onNewTag(newTag, id, options, value) {
                options.push(newTag)
                value.push(newTag)
                this.model.datasets.push(newTag)
              },
            },
            onChanged: function (model, newVal, oldVal, field) {
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
          }
        ]
      },
      formOptions: {
        validateAfterLoad: true,
        validateAfterChanged: true,
      },
      types: ['Datasets', 'Combinators', 'Map Layers', 'Categories'],
      category: ['Textual', 'Archaeological', 'Environmental'],
      createUrl: '',
      editUrl: '',
      routeUrl: '',
    }
  },
  created() {
    this.setData()
  },
  methods: {
    setData() {
      let vm = this
      if (this.item) {
        this.model = this.item
        this.model.file = null
      }
      this.setUrl()

      this.model.type = this.collectionType
      this.model.action = this.action

      this.schema.fields.forEach((field) => {
        if (field.buttonText === 'Submit' || field.model === 'name' || field.model === 'description' || field.buttonText === 'Delete') {
          if (field.buttonText === 'Delete' && (this.action === 'Add new Map Layer' || this.action === 'Add new Category')) {
            field.visible = false
          }
          else {
            return
          }
        }

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
      })
    },
    setUrl() {
      if (this.collectionType === 'Map Layers') {
        if (this.item) {
          this.editUrl = `${this.$baseUrl}/map-layers/${this.item.id}`
        }
        this.routeUrl = '/dashboard/maplayers'
      }
      else if (this.collectionType === 'Combinators') {
        if (this.item) {
          this.editUrl = `${this.$baseUrl}/combinators/${this.item.id}`
        }
        this.routeUrl = '/dashboard/combinators'
      }
      else if (this.collectionType === 'Categories') {
        if (this.item) {
          this.editUrl = `${this.$baseUrl}/categories/${this.item.id}`
        }
        this.routeUrl = '/dashboard/categories'
      }
    },

    deleteItem() {
      let vm = this
      axios
      .delete(this.editUrl)
      .then((response) => {
        // Handle success.
        console.log('success')
        console.log(response)
        this.$router.push(this.routeUrl)
      })
      .catch((error) => {
        // Handle error.
        console.log('error')
        console.log(error)
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
      }
      else if (this.model.type === 'Datasets') {
        this.createUrl = `${this.$baseUrl}/datasets`
        data.name = this.model.name
        data.description = this.model.description
        data.citation = this.model.citation
        data.link = this.model.link
        data.category = this.model.category
        formData.append('files.image', this.model.file, this.model.file.name)
      }
      else if (this.model.type === 'Combinators') {
        this.createUrl = `${this.$baseUrl}/combinators`
        data.name = this.model.name
        data.description = this.model.description
        data.citation = this.model.citation
      }
      else if (this.model.type === 'Categories') {
        this.createUrl = `${this.$baseUrl}/categories`
        data.name = this.model.name
        data.description = this.model.description
        data.color = this.model.color
      }

      formData.append('data', JSON.stringify(data))
      if (this.action === 'Update Map Layer' || this.action === 'Update Category') {
        axios
        .put(this.editUrl, formData)
        .then((response) => {
          // Handle success.
          console.log('success')
          console.log(response)
          this.$emit('submit')
          this.$router.push(this.routeUrl)
        })
        .catch((error) => {
          // Handle error.
          console.log('error')
          console.log(error)
        })
      }
      else {
        axios
        .post(this.createUrl, formData)
        .then((response) => {
          // Handle success.
          console.log('success')
          console.log(response)
          this.$emit('submit')
          this.$router.push(this.routeUrl)
        })
        .catch((error) => {
          // Handle error.
          console.log('error')
          console.log(error)
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
-webkit-box-shadow: 0 1px 1px rgba(0, 0, 0, .05);
box-shadow: 0 1px 1px rgba(0, 0, 0, .05);
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
