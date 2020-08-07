const methods = {
  getSource(path, key) {
    return axios.get(`${this.$baseUrl}/${path}`).then((response) => {
      if (key) {
        return response.data[key]
      }
      return response.data
    }).catch((error) => {
      console.log("error")
      console.log(error)
    })
  },
  setFormField(val, type) {
    this.schema.fields.filter((field) => {
      if (field.model && field.model === type) {
        field.values = val
      }
    })
  },
  setFormData(val) {
    const formData = new FormData()
    const data = {}
    if (val.type === 'Map Layers') {
      this.createUrl = `${this.$baseUrl}/map-layers`
      data.title = val.title
      data.description = val.description
      if (val.source && val.source.name) {
        formData.append('files.file', val.source, val.source.name)
      }
    } else if (val.type === 'Combinators') {
      this.createUrl = `${this.$baseUrl}/combinators`
      data.title = val.title
      data.description = val.description
      data.citation = val.citation
    } else if (val.type === 'Categories') {
      this.createUrl = `${this.$baseUrl}/categories`
      data.title = val.title
      data.description = val.description
      data.color = val.color
    } else if (val.type === 'Datasets') {
      this.createUrl = `${this.$baseUrl}/datasets`
      data.title = val.title
      data.description = val.description
      data.citation = val.citation
      data.link = val.link
      if(val.category) {
        const temp = this.categories.filter((category) => {
          if (category.id === val.category) {
            return category
          }
        })
        data.category = temp[0].name
      }
      data.combinators = val.combinators
      data.fields = val.fields
      data.templates = val.templates
      data.features = val.features
    } else if (val.type === 'Users') {
      this.createUrl = `${process.env.VUE_APP_STRAPI_API_URL}/auth/local/register`
      data.username = val.username
      data.email = val.email
      data.provider = val.provider
      data.password = val.password
      data.role = val.role
      data.events = val.events
    }
    formData.append('data', JSON.stringify(data))
    if (val.type !== 'Users') {
      return formData
    }
    return data
  },
  limitFields() {
    // Keep basic fields for all forms
    this.schema.fields.forEach((field) => {
      if (field.buttonText === 'Submit' || field.model === 'title' || field.model === 'description' || field.buttonText === 'Delete') {
        // If adding a new **, hide Delete button
        if (field.buttonText === 'Delete' && (this.action === 'Create')) {
          field.visible = false
        } else if (this.collectionType === 'Users' && (field.model === 'title' || field.model === 'description')) {
          field.visible = false
        } else {
          return
        }
      }
      // Limit fields depending on collectionType
      if (this.collectionType === 'Map Layers') {
        if (field.model !== 'source') {
          field.visible = false
        }
      }
      if (this.collectionType === 'Combinators') {
        if (field.model !== 'citation') {
          field.visible = false
        }
      }
      if (this.collectionType === 'Categories') {
        if (field.model !== 'color') {
          field.visible = false
        }
      }
      if (this.collectionType === 'Datasets') {
        if (
          field.model !== 'citation'
       && field.model !== 'link'
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
       && field.model !== 'password'
       && field.model !== 'provider'
       && field.model !== 'confirmed'
       && field.model !== 'blocked'
       && field.model !== 'role'
       && field.model !== 'events'
        ) {
          field.visible = false
        }
      }
    })
  },

}

const asyncComputed = {
  mapLayers: {
    get() {
      // if (this._mapLayers && this._mapLayers.length > 0) {
      //   return this._mapLayers
      // }
      return this.getSource('map-layers')
      .then((mapLayers) => {
        this._mapLayers = mapLayers
        // if (this.schema) {
        //   this.setFormField(this._mapLayers, 'mapLayers')
        // }
        return this._mapLayers
      })
    },
    shouldUpdate() {
      return (this.collectionType === 'Map Layers' || this.component === 'MapLayers')
    },
  },
  datasets: {
    get() {
      // if (this._datasets && this._datasets.length > 0) {
      //   return this._datasets
      // }
      return this.getSource('datasets')
      .then((datasets) => {
        this._datasets = datasets
        if (this.schema) {
          this.setFormField(this._datasets, 'datasets')
        }
        return this._datasets
      })
    },
    shouldUpdate() {
      return (this.collectionType === 'Datasets' || this.component === 'Datasets')
    },
  },
  events: {
    get() {
      if (this._events && this._events.length > 0) {
        return this._events
      }
      return this.getSource('events')
      .then((events) => {
        this._events = events
        if (this.schema) {
          this.setFormField(this._events, 'events')
        }
        return this._events
      })
    },
    shouldUpdate() {
      return (this.collectionType === 'Events' || this.collectionType === 'Users' || this.component === 'Events')
    },
  },
  combinators: {
    get() {
      if (this._combinators && this._combinators.length > 0) {
        return this._combinators
      }
      return this.getSource('combinators')
      .then((combinators) => {
        this._combinators = combinators
        if (this.schema) {
          this.setFormField(this._combinators, 'combinators')
        }
        return this._combinators
      })
    },
    shouldUpdate() {
      return (this.collectionType === 'Combinators' || this.collectionType === 'Datasets' || this.component === 'Combinators')
    },
  },
  categories: {
    get() {
      // if (this._categories && this._categories.length > 0) {
      //   return this._categories
      // }
      return this.getSource('categories')
      .then((categories) => {
        this._categories = categories
        if (this.schema) {
          this.setFormField(this._categories, 'category')
        }
        return this._categories
      })
    },
    shouldUpdate() {
      return (this.collectionType === 'Datasets' || this.collectionType === 'Categories' || this.component === 'Categories')
    },
  },
  fields: {
    get() {
      if (this._fields && this._fields.length > 0) {
        return this._fields
      }
      return this.getSource('dataset-fields')
      .then((fields) => {
        this._fields = fields
        if (this.schema) {
          this.setFormField(this._fields, 'fields')
        }
        return this._fields
      })
    },
    shouldUpdate() {
      return (this.collectionType === 'Fields' || this.collectionType === 'Datasets' || this.component === 'Fields')
    },
  },
  templates: {
    get() {
      if (this._templates && this._templates.length > 0) {
        return this._templates
      }
      return this.getSource('dataset-templates')
      .then((templates) => {
        this._templates = templates
        if (this.schema) {
          this.setFormField(this._templates, 'templates')
        }
        return this._templates
      })
    },
    shouldUpdate() {
      return (this.collectionType === 'Templates' || this.collectionType === 'Datasets' || this.component === 'Templates')
    },
  },
  features: {
    get() {
      if (this._features && this._features.length > 0) {
        return this._features
      }
      return this.getSource('dataset-features')
      .then((features) => {
        this._features = features
        if (this.schema && features.length > 0) {
          this.setFormField(this._features, 'features')
        }
        return this._features
      })
    },
    shouldUpdate() {
      return (this.collectionType === 'Features' || this.collectionType === 'Datasets' || this.component === 'Features')
    },
  },
  roles: {
    get() {
      if (this._roles && this._roles.length > 0) {
        return this._roles
      }
      return this.getSource('users-permissions/roles', 'roles')
      .then((roles) => {
        this._roles = roles
        if (this.schema) {
          this.setFormField(this._roles, 'roles')
        }
        return this._roles
      })
    },
    shouldUpdate() {
      return (this.collectionType === 'Users' || this.component === 'Users')
    },
  },
}
export default {
  methods,
  asyncComputed,
};
