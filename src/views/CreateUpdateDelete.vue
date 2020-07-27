<template>
  <div>
    <b-container>
      <b-form
        class="Create"
        @submit.prevent="create()"
      >
        <h3>{{ form.action }}</h3>
        <!-- Create Dataset -->
        <b-form-group v-if="form.type == 'Datasets'">
          <label>Name</label>
          <input
            v-model="form.name"
            required
            type="text"
            class="form-control form-control-lg"
          >
          <label>Description</label>
          <input
            v-model="form.description"
            type="text"
            class="form-control form-control-lg"
          >
          <label>Citation</label>
          <input
            v-model="form.citation"
            type="text"
            class="form-control form-control-lg"
          >
          <label>Link</label>
          <input
            v-model="form.link"
            type="text"
            class="form-control form-control-lg"
          >
          <label>Image</label>
          <b-form-file
            v-model="form.file"
            :state="Boolean(form.file)"
            placeholder="Choose an image or drop it here..."
            drop-placeholder="Drop file here..."
            class="form-control form-control-lg"
          />
          <label>Category</label>
          <b-form-select
            v-model="form.category"
            :options="category"
            required
          />
          <br>
          <b-button
            type="submit"
            variant="primary"
          >
            Submit
          </b-button>
        </b-form-group>

        <!-- Create Combinator -->
        <b-form-group v-if="form.type == 'Combinators'">
          <label>Name</label>
          <input
            v-model="form.name"
            required
            type="text"
            class="form-control form-control-lg"
          >
          <label>Description</label>
          <input
            v-model="form.description"
            type="text"
            class="form-control form-control-lg"
          >
          <label>Citation</label>
          <input
            v-model="form.citation"
            type="text"
            class="form-control form-control-lg"
          >
          <b-button
            type="submit"
            variant="primary"
          >
            Submit
          </b-button>
        </b-form-group>

        <!-- Create Map Layer -->
        <b-form-group v-if="form.type == 'Map Layers'">
          <label>Name</label>
          <input
            v-model="form.name"
            required
            type="text"
            class="form-control form-control-lg"
          >
          <label>Description</label>
          <input
            v-model="form.description"
            type="text"
            class="form-control form-control-lg"
          >
          <label>File</label>
          <b-form-file
            v-model="form.file"
            required
            :state="Boolean(form.file)"
            placeholder="Choose a file or drop it here..."
            drop-placeholder="Drop file here..."
            class="form-control form-control-lg"
          />
          <b-button
            type="submit"
            variant="primary"
          >
            Submit
          </b-button>
        </b-form-group>
      </b-form>
    </b-container>
  </div>
</template>

<script>
import gql from 'graphql-tag'
export default {
  props: ['item', 'action', 'collectionType'],
  data() {
    return {
      form: {
        type: '',
        action: '',
        name: '',
        description: '',
        citation: '',
        link: '',
        file: null,
        category: '',
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
      if (this.item) {
        this.form = this.item
      }
      this.form.type = this.collectionType
      this.form.action = this.action
    },
    create() {
      const formData = new FormData()
      let url = ''
      const data = {}
      if (this.form.type === 'Map Layers') {
        url = `${this.$baseUrl}/map-layers`
        data.name = this.form.name
        data.description = this.form.description
        formData.append('files.file', this.form.file, this.form.file.name)
      }
      else if (this.form.type === 'Datasets') {
        url = `${this.$baseUrl}/datasets`
        data.name = this.form.name
        data.description = this.form.description
        data.citation = this.form.citation
        data.link = this.form.link
        data.category = this.form.category
        formData.append('files.image', this.form.file, this.form.file.name)
      }
      else if (this.form.type === 'Combinators') {
        url = `${this.$baseUrl}/combinators`
        data.name = this.form.name
        data.description = this.form.description
        data.citation = this.form.citation
      }

      formData.append('data', JSON.stringify(data))

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
    },
  },
}
</script>
