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
import gql from 'graphql-tag'
export default {
  props: ['item', 'action', 'collectionType'],
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
      },
      schema: {
        legend: 'Map Layers',
        fields: [
          {
            type: 'input',
            inputType: 'text',
            label: 'Name',
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
            type: 'submit',
            buttonText: 'Submit',
            inputType: 'submit',
            visible: true,
            onSubmit: this.create,
          },
          {
            type: 'submit',
            buttonText: 'Delete',
            inputType: 'submit',
            visible: true,
            onSubmit: this.deleteMapLayer,
          }
        ]
      },
      formOptions: {
        validateAfterLoad: true,
        validateAfterChanged: true
      },
      types: ['Datasets', 'Combinators', 'Map Layers'],
      category: ['Textual', 'Archaeological', 'Environmental'],
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
      this.model.type = this.collectionType
      this.model.action = this.action

      this.schema.fields.forEach((field) => {
        if (field.buttonText === 'Submit' || field.model === 'name' || field.model === 'description' || field.buttonText === 'Delete') {
          if (field.buttonText === 'Delete' && this.action === 'Add new Map Layer') {
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
      })
    },
    deleteMapLayer() {
      let vm = this
      let url = ''
      url = `${this.$baseUrl}/map-layers/${this.item.id}`
      axios
      .delete(url)
      .then((response) => {
        // Handle success.
        console.log('success')
        console.log(response)
        this.$router.push('/dashboard/maplayers')
      })
      .catch((error) => {
        // Handle error.
        console.log('error')
        console.log(error)
      })
    },
    create() {
      const formData = new FormData()
      let url = ''
      const data = {}
      if (this.model.type === 'Map Layers') {
        url = `${this.$baseUrl}/map-layers`
        data.name = this.model.name
        data.description = this.model.description
        if (this.model.file) {
          formData.append('files.file', this.model.file, this.model.file.name)
        }
      }
      else if (this.model.type === 'Datasets') {
        url = `${this.$baseUrl}/datasets`
        data.name = this.model.name
        data.description = this.model.description
        data.citation = this.model.citation
        data.link = this.model.link
        data.category = this.model.category
        formData.append('files.image', this.model.file, this.model.file.name)
      }
      else if (this.model.type === 'Combinators') {
        url = `${this.$baseUrl}/combinators`
        data.name = this.model.name
        data.description = this.model.description
        data.citation = this.model.citation
      }

      formData.append('data', JSON.stringify(data))
      if (this.action === 'Update Map Layer') {
        axios
        .put(`${url}/${this.model.id}`, formData)
        .then((response) => {
          // Handle success.
          console.log('success')
          console.log(response)
          this.$router.push('/dashboard/maplayers')
        })
        .catch((error) => {
          // Handle error.
          console.log('error')
          console.log(error)
        })
      }
      else {
        axios
        .post(url, formData)
        .then((response) => {
          // Handle success.
          console.log('success')
          console.log(response)
          this.$router.push('/dashboard/maplayers')
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
