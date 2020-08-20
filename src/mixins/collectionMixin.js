import gql from 'graphql-tag'
import { Combinators, MapLayers, Categories, Datasets, Users, DatasetFields } from '../models'
import TableViewLayout from '../views/Collections/templates/TableViewLayout.vue'

const Models = {
  'Combinators': Combinators,
  'MapLayers': MapLayers,
  'Categories': Categories,
  'Datasets': Datasets,
  'Users': Users,
  'DatasetFields': DatasetFields,
}

const apollo = {
  // datasets: {
  //   query: gql`
  //     query {
  //       datasets {
  //         id
  //         name
  //         title
  //         description
  //         citation
  //         processing
  //         processedAt
  //       }
  //     }
  //   `,
  //   skip: true,
  //   ssr: false,
  // },
  dataset: {
    query: gql`query dataset($id: ID!) {
      dataset(id: $id) {
        id
        name
        title
        description
        citation
        link
        category{
          id
          name
          title
        }
        title_layout
        link_layout
        details_layout
        summary_layout
        fields{
          id
          name
          title
          type
        }
      }
    }`,
    // Reactive parameters
    variables() {
      // Use vue reactive properties here
      return {
        id: this.currentId,
      }
    },
    skip: (this ? (this.currentDataset || !this.currentId) : true),
    ssr: false,
    // Variables: deep object watch
    deep: false,
    // We use a custom update callback because
    // the field names don't match
    // By default, the 'currentDataset' attribute
    // would be used on the 'data' result object
    // Here we know the result is in the 'id' attribute
    // considering the way the apollo server works
    update(data) {
      // The returned value will update
      // the vue property 'currentDataset'
      return data.id
    },
    // Optional result hook
    result({ data, loading, networkStatus }) {
      if (data && data.dataset) {
        this.currentDataset = data.dataset
        this.fieldsCount = this.currentDataset.fields.length
      }
    },
    // Error handling
    error(error) {
      console.error('We\'ve got an error!', error)
    },
    // Loading state
    // loadingKey is the name of the data property
    // that will be incremented when the query is loading
    // and decremented when it no longer is.
    loadingKey: 'loadingQueriesCount',
    // watchLoading will be called whenever the loading state changes
    watchLoading (isLoading, countModifier) {
      // isLoading is a boolean
      // countModifier is either 1 or -1
    },
  },
}

const methods = {
  async process(val) {
    this.currentId = val.id
    val.processing = true
    const resp = await axios.get(`${this.$baseUrl}/datasets/${val.id}/process`)
    if (resp) {
      val.processing = false
      this.$apollo.queries.datasets.refetch()
    }
  },
  async getSingle(path) {
    try {
      const temp = await axios.get(`${this.$baseUrl}/${path}`)
      return temp
    } catch (err) {
      console.log(err)
    }
  },
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
    const dataModel = new Models[val.type](val)
    if (val.action === 'Create') {
      dataModel._create().then((value) => {
        this.$router.push(dataModel.routeUrl)
      })
    }
    else {
      dataModel._update().then((value) => {
        if (val.type === 'DatasetFields') {
          return
        }
        else if(val.goBack) {
          this.$router.go(-1)
        }
        else {
          this.$router.push(dataModel.routeUrl)
        }
      })
    }
  },
  limitFields() {
    const dataModel = Models[this.model.type]
    this.schema.fields.forEach((field) => {
      if (field.buttonText === 'Delete') {
        // If adding a new **, hide Delete button
        if (this.model.action === 'Create') {
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
  datasetList: {
    get() {
      if (this._datasets && this._datasets.length > 0) {
        return this._datasets
      }
      return this.getSource('datasets')
      .then((datasets) => {
        this._datasets = datasets
        if (this.schema && this.collectionType === 'Combinators') {
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
      return this.component === 'Combinators'
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
      return (this.collectionType === 'Datasets' || this.component === 'Categories' || this.component === 'Dataset View')
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
    currentId: '',
    datasets: [],
    currentDataset: {},
  }
}

export default {
  apollo,
  methods,
  asyncComputed,
  data,
  components: {
    TableViewLayout,
  },
};
