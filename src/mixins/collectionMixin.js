import { Combinators, MapLayers, Categories, Datasets, Users } from '../models'
import TableViewLayout from '../views/Collections/templates/TableViewLayout.vue'

const Models = {
  'Combinators': Combinators,
  'MapLayers': MapLayers,
  'Categories': Categories,
  'Datasets': Datasets,
  'Users': Users,
}


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
    const vm = this
    const dataModel = new Models[val.type](val)
    if (this.action === 'Create') {
      dataModel._create().then((value) => {
        this.$router.push(dataModel.routeUrl)
      })
    }
    else {
      dataModel._update().then((value) => {
        this.$router.push(dataModel.routeUrl)
      })
    }
  },
  limitFields() {
    const dataModel = Models[this.collectionType]
    this.schema.fields.forEach((field) => {
      if (field.buttonText === 'Delete') {
        // If adding a new **, hide Delete button
        if (this.action === 'Create') {
          field.visible = false
        }
        return
      }
    // Always display submit
      if (field.buttonText === 'Submit') {
        return
      }
      if (field.model) {
        field.visible = dataModel.isAttributeFillable(field.model)
      }
    })
  },
  updatePage(val) {
    this.currentPage = val
  },
  updateLimit(val) {
    this.perPage = val
  },
  deleteItem(item, type) {
    this.$bvModal.hide('deleteConfirmation')
    const dataModel = new Models[item.type ? item.type : type](item)
    dataModel._delete().then((value) => {
      if (dataModel.routeUrl === this.$router.history.current.path) {
        if (value === 'users') {
          this.getAllUsers()
        }
        else {
          this.$asyncComputed[value].update()
        }
      }
      else {
        this.$router.push(dataModel.routeUrl)
      }
    })
  },
}

const asyncComputed = {
  rows: {
    get() {
      if (this.component === 'MapLayers') {
        return this.mapLayers.length
      }
      if (this.component === 'Users' && this.total > 0) {
        return this.total
      }
      return this[this.component.toLowerCase()].length
    },
    shouldUpdate() {
      if (this.component === 'MapLayers') {
        return (this.component && this.mapLayers)
      }
      return (this.component && (this.component === 'Users' || this[this.component.toLowerCase()]))
    },
  },
// Keeping _***** values to get cache working later on possibly
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
      return (this.component === 'MapLayers')
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
      return (this.collectionType === 'Combinators' || this.component === 'Datasets')
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
      // if (this._combinators && this._combinators.length > 0) {
      //   return this._combinators
      // }
      return this.getSource('combinators?_limit=200')
      .then((combinators) => {
        this._combinators = combinators
        if (this.schema) {
          this.setFormField(this._combinators, 'combinators')
        }
        return this._combinators
      })
    },
    shouldUpdate() {
      return (this.collectionType === 'Datasets' || this.component === 'Combinators')
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
        if (this.schema && this.component !== 'Categories') {
          this.setFormField(this._categories, 'category')
        }
        return this._categories
      })
    },
    shouldUpdate() {
      return (this.collectionType === 'Datasets' || this.component === 'Categories')
    },
  },
  queries: {
    get() {
      // if (this._queries && this._queries.length > 0) {
      //   return this._queries
      // }
      return this.getSource('combinator-queries')
      .then((queries) => {
        this._queries = queries
        if (this.schema) {
          this.setFormField(this._queries, 'queries')
        }
        return this._queries
      })
    },
    shouldUpdate() {
      return (this.collectionType === 'Combinators' || this.component === 'Queries')
    },
  },
  concepts: {
    get() {
      // if (this._concepts && this._concepts.length > 0) {
      //   return this._concepts
      // }
      return this.getSource('concepts')
      .then((concepts) => {
        this._concepts = concepts
        if (this.schema) {
          this.setFormField(this._concepts, 'concepts')
        }
        return this._concepts
      })
    },
    shouldUpdate() {
      return (this.collectionType === 'Combinators' || this.collectionType === 'Concepts' || this.component === 'Concepts')
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
      return (this.collectionType === 'Users')
    },
  },
}

const data = function() {
  return {
    deleteModal: false,
    itemToDelete: [],
    currentPage: 1,
    perPage: 10,
    limits: [10, 20, 50, 100],
  }
}

export default {
  methods,
  asyncComputed,
  data,
  components: {
    TableViewLayout,
  },
};
