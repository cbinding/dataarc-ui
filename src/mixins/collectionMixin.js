import gql from 'graphql-tag';
import {
  Combinators,
  MapLayers,
  Categories,
  Datasets,
  Users,
  DatasetFields,
  TemporalCoverages,
  TopicMaps,
} from '../models';
import TableViewLayout from '../views/Collections/templates/TableViewLayout.vue';

const Models = {
  Combinators,
  MapLayers,
  Categories,
  Datasets,
  Users,
  DatasetFields,
  TemporalCoverages,
  TopicMaps,
};

const apollo = {
  allCombinators: {
    query: gql`
      query combinators($start: Int, $limit: Int) {
        combinators(start: $start, limit: $limit) {
          id
          name
          title
          description
          citation
          url
          operator
          state
          state_msg
          state_at
          created_by {
            id
            username
          }
          updated_by {
            id
            username
          }
        }
        countCombinators
      }
    `,
    skip: true,
    ssr: false,
    variables() {
      // Use vue reactive properties here
      return {
        limit: this && this.combinators.length === 0 && this.currentPage === 1 ? 20 : 50,
        start: this && this.combinators.length === 0 && this.currentPage === 1 ? 0 : this.combinators.length,
      };
    },
    update(data) {
      return data.allCombinators;
    },
    result({ data, loading, networkStatus }) {
      if (data) {
        if (this.combinators.length === 0) {
          this.combinators = data.combinators
        }
        else {
          this.combinators = _.unionWith(this.combinators, data.combinators, _.isEqual)
        }
        if (this.rows !== data.countCombinators) {
          this.rows = data.countCombinators
        }
      }
    },
  },
  allCategories: {
    query: gql`
      query {
        categories {
          id
          name
          title
          description
          color
          datasets {
            title
          }
        }
      }
    `,
    skip: true,
    ssr: false,
    update(data) {
      // The returned value will update
      // the vue property 'datasets'
      return data.allCategories;
    },
    result({ data, loading, networkStatus }) {
      if (data) {
        this.categories = data.categories;
        this.rows = this.categories.length
      }
    },
  },
  allTemporalCoverages: {
    query: gql`
      query {
        temporalCoverages {
          id
          name
          title
          description
          citation
          url
          start_date
          end_date
        }
      }
    `,
    skip: true,
    ssr: false,
    update(data) {
      // The returned value will update
      // the vue property 'datasets'
      return data.allTemporalCoverages;
    },
    result({ data, loading, networkStatus }) {
      if (data) {
        this.temporalCoverages = data.temporalCoverages;
        this.rows = this.temporalCoverages.length
      }
    },
  },
  allTopicMaps: {
    query: gql`
      query {
        topicMaps {
          id
          name
          title
          description
          citation
          url
          topics_count
        }
      }
    `,
    skip: true,
    ssr: false,
    update(data) {
      // The returned value will update
      // the vue property 'datasets'
      return data.allTopicMaps;
    },
    result({ data, loading, networkStatus }) {
      if (data) {
        this.topicMaps = data.topicMaps;
        this.rows = this.topicMaps.length
      }
    },
  },
  allMapLayers: {
    query: gql`
      query {
        mapLayers {
          id
          name
          title
          description
        }
      }
    `,
    skip: true,
    ssr: false,
    update(data) {
      // The returned value will update
      // the vue property 'datasets'
      return data.allMapLayers;
    },
    result({ data, loading, networkStatus }) {
      if (data) {
        this.mapLayers = data.mapLayers;
        this.rows = this.mapLayers.length
      }
    },
  },
  allDatasets: {
    query: gql`
      query {
        datasets {
          id
          name
          title
          description
          citation
          source{
            name
          }
          state
          state_msg
          state_at
          fields_count
          features_count
          combinators_count
        }
      }
    `,
    pollInterval: 5000,
    skip: true,
    update(data) {
      // The returned value will update
      // the vue property 'datasets'
      return data.allDatasets;
    },
    result({ data, loading, networkStatus }) {
      if (data) {
        let stopQuery = data.datasets.filter((dataset) => {
          if (
            !(
              dataset.state === 'done' ||
              dataset.state === 'pending' ||
              dataset.state === 'failed' ||
              dataset.state === '' ||
              dataset.state === null
            )
          ) {
            return dataset;
          }
        });
        if (stopQuery.length === 0 || this.component !== 'Datasets') {
          this.$apollo.queries.allDatasets.stopPolling();
        } else {
          this.$apollo.queries.allDatasets.startPolling(5000);
        }
        this.datasets = data.datasets;
        this.rows = this.datasets.length
      }
    },
  },
  dataset: {
    query: gql`
      query datasets($id: ID!) {
        datasets(where: {id: $id}) {
          id
          name
          title
          description
          citation
          url
          category {
            id
            name
            title
          }
          features_count
          fields_count
          combinators_count
          title_layout
          link_layout
          details_layout
          summary_layout
          fields {
            id
            name
            title
            type
            path
            source
          }
          combinators {
            id
            name
            title
            description
            citation
          }
        }
      }
    `,
    // Reactive parameters
    variables() {
      // Use vue reactive properties here
      return {
        id: this.currentDatasetId ? this.currentDatasetId : this.currentId,
      };
    },
    skip: true,
    ssr: false,
    // Variables: deep object watch
    deep: false,
    update(data) {
      // The returned value will update
      // the vue property 'currentDataset'
      return data.id;
    },
    // Optional result hook
    result({ data, loading, networkStatus }) {
      if (data && data.datasets) {
        this.currentDataset = data.datasets[0];
        this.fieldsCount = this.currentDataset.fields.length;
        this.combinatorsCount = this.currentDataset.combinators.length;
      }
    },
    // Error handling
    error(error) {
      console.error("We've got an error!", error);
    },
  },
  combinator: {
    query: gql`
      query combinators($id: ID!) {
        combinators(where: {id: $id}) {
          id
          name
          title
          description
          citation
          url
          operator
          state
          state_msg
          state_at
          queries {
            id
            property
            property_type
            operator
            value
          }
          concepts {
            id
            name
            title
            group
            _id
          }
          dataset {
            id
            title
            fields {
              id
              path
              type
            }
          }
        }
      }
    `,
    // Reactive parameters
    variables() {
      // Use vue reactive properties here
      return {
        id: this.currentId,
      };
    },
    skip: true,
    ssr: false,
    // Variables: deep object watch
    deep: false,
    update(data) {
      // The returned value will update
      // the vue property 'currentDataset'
      return data.id;
    },
    // Optional result hook
    result({ data, loading, networkStatus }) {
      if (data && data.combinators) {
        this.currentCombinator = data.combinators[0];

        // Set Concepts to complete concept objects
        if (this.concepts) {
          let concepts = []
          this.currentCombinator.concepts.forEach((concept) => {
            this.concepts.filter((val) => {
              if (val.id === concept.id) {
                concepts.push(val)
              }
            })
          })
          this.currentCombinator.concepts = concepts
        }
        this.model = this.currentCombinator
        if (this.model.dataset && this.model.dataset.id) {
          this.model.dataset = this.model.dataset.id
        }
        this.currentDatasetId = this.model.dataset
        this.$apollo.queries.dataset.skip = false
        this.model.type = this.collectionType
        this.model.action = this.action
        this.loading = false
      }
    },
    // Error handling
    error(error) {
      console.error("We've got an error!", error);
    },
  },
  queryResults: {
    query: gql`
      query combinatorResults($id: ID!){
        combinatorResults(id: $id) {
          combinator {
            id
            name
          }
          features {
            id
            properties
          }
          matched_count
          total_count
        }
      }
    `,
    // Reactive parameters
    variables() {
      // Use vue reactive properties here
      return {
        id: this.currentCombinator.id,
      };
    },
    skip: true,
    ssr: false,
    // Variables: deep object watch
    deep: false,
    update(data) {
      return data.id;
    },
    // Optional result hook
    result({ data, loading, networkStatus }) {
      if (data && data.combinatorResults) {
        this.loading = false
        this.filteredFeatures = data.combinatorResults;
        this.rows = this.filteredFeatures.matched_count
      }
    },
    // Error handling
    error(error) {
      console.error("We've got an error!", error);
    },
  },
  getRandomFeature: {
    query: gql`
      query randomFeature($id: ID!){
        randomFeature(where: {dataset: $id}) {
          id
          properties
        }
      }
    `,
    // Reactive parameters
    variables() {
      // Use vue reactive properties here
      return {
        id: this.currentDatasetId ? this.currentDatasetId : this.currentId,
      };
    },
    skip: true,
    ssr: false,
    // Variables: deep object watch
    deep: false,
    update(data) {
      return data.id;
    },
    // Optional result hook
    result({ data, loading, networkStatus }) {
      if (data && data.randomFeature) {
        this.randomFeature = data.randomFeature;
      }
    },
    // Error handling
    error(error) {
      console.error("We've got an error!", error);
    },
  },
};

const methods = {
  async process(val, component) {
    this.currentId = val.id;
    let url = component === 'Datasets' ? 'datasets' : 'topic-maps'
    val.state = 'processing';
    const resp = await axios.get(`${this.$apiUrl}/${url}/${val.id}/process`);
    if (resp) {
      this.$apollo.queries[`all${component}`].refetch();
    }
  },
  async getSingle(path) {
    try {
      const temp = await axios.get(`${this.$apiUrl}/${path}`);
      return temp;
    } catch (err) {
      console.log(err);
    }
  },
  getSource(path, key) {
    return axios
      .get(`${this.$apiUrl}/${path}`)
      .then((response) => {
        if (key) {
          return response.data[key];
        }
        return response.data;
      })
      .catch((error) => {
        console.log('error');
        console.log(error);
      });
  },
  setFormField(val, type) {
    this.schema.fields.filter((field) => {
      if (field.model && field.model === type) {
        field.values = val;
      }
    });
  },
  setFormData(val) {
    const dataModel = new Models[val.type](val);
    if (val.action === 'Create') {
      dataModel._create().then((value) => {
        this.$router.push(dataModel.routeUrl);
      });
    } else {
      dataModel._update().then((value) => {
        if (val.type === 'DatasetFields' || val.type === 'Users') {
          this.showAlert()
          return;
        } if (val.type === 'Combinators') {
          this.$router.push(dataModel.routeUrl);
        } else {
          this.$router.go(-1);
        }
      });
    }
  },
  updatePage(val, component) {
    if (this.$route.name === 'Dataset View') {
      this[`current${component}Page`] = val;
    } else {
      this.currentPage = val;
      if (this.$route.name === 'Combinators') {
        this.combinatorsLoading = (this.currentPage * this.perPage) - (this.perPage - 1) > this.combinators.length
      }
    }
  },
  updateLimit(val, component) {
    if (this.$route.name === 'Dataset View') {
      this[`current${component}Limit`] = val;
    } else {
      this.perPage = val;
    }
  },
  deleteItem(item, type) {
    let array = this.lcFirst(type)
    if (this[array]) {
      const test = _.remove(this[array], function (val) {
        return val.id === item.id
      })
      if (test.length > 0) {
        this.rows -= 1
        if (this.$refs[array]) {
          this.$refs[array].refresh()
        }
      }
      this.$bvModal.hide('deleteConfirmation');
      const dataModel = new Models[item.type ? item.type : type](item);
      dataModel._delete().then((value) => {
        if (dataModel.routeUrl === this.$router.history.current.path) {
          if (value === 'users') {
            this.showAlert();
            this.getAllUsers();
          }
        } else {
          this.$router.push(dataModel.routeUrl);
        }
      });
    }
  },
  getDate(val) {
    if (!val) {
      return '';
    }
    const newDate = new Date(val);
    return newDate.toLocaleString();
  },
  updateFilter(val, component) {
    if (this.$route.name === 'Dataset View') {
      this[`filter${component}`] = val;
    } else {
      this.filter = val;
    }
  },
  updatePagination(array, val) {
    if (this.$route.name === 'Dataset View') {
      if (array[0].__typename === 'DatasetField') {
        this.fieldsCount = val;
      } else {
        this.combinatorsCount = val;
      }
    }
    this.currentPage = 1
    this.rows = val
  },
  _equals(string, val, type) {
    if (type === 'number') {
      return string === Number(val)
    }
    if (type === 'boolean') {
      const isTrueSet = (val === 'true')
      return string === isTrueSet
    }
    return string === val
  },
  _not_equals(string, val, type) {
    if (type === 'number') {
      return string !== Number(val)
    }
    if (type === 'boolean') {
      const isTrueSet = (val === 'true')
      return string !== isTrueSet
    }
    return string !== val
  },
  _contains(string, val) {
    return string.includes(val)
  },
  _not_contains(string, val) {
    return !string.includes(val)
  },
  _greater_than(int, val, type) {
    if (type === 'number') {
      return int > Number(val)
    }
    return int > val
  },
  _less_than(int, val, type) {
    if (type === 'number') {
      return int < Number(val)
    }
    return int < val
  },
  testQueries(val) {
    this.loading = true
    const dataModel = new Models['Combinators'](val);
  // If combinator doesn't already exist, create it, then get query results
    if (!this.currentCombinator && this.model.action !== 'Update') {
      dataModel._create().then((value) => {
        this.currentCombinator = value.data
        this.$router.push(`/contributor/combinators/update/${value.data.id}`)
        this.action = 'Update'
        this.model.action = 'Update'
        this.$apollo.queries.queryResults.skip = false
      });
    }
  // If combinator exists, update it, then get query results
    else {
      val.id = this.model.id
      const newModel = new Models['Combinators'](val)
      newModel._update().then((value) => {
        this.currentCombinator = value.data
        this.$apollo.queries.queryResults.skip = false
        this.$apollo.queries.queryResults.refetch()
      });
    }
  },
  shorten(val) {
    if (val.length > 150) {
      return val.substring(0, 150) + "..."
    }
    return val
  },
  lcFirst(string) {
    return string.charAt(0).toLowerCase() + string.slice(1);
  },
};

const asyncComputed = {
  // Keeping _***** values to get cache working later on possibly
  concepts: {
    get() {
      if (this._concepts && this._concepts.length > 0) {
        return this._concepts
      }
      return this.getSource('concepts?_limit=-1').then((concepts) => {
        this._concepts = concepts;
        if (this.schema) {
          this.setFormField(this._concepts, 'concepts');
        }
        return this._concepts;
      });
    },
    shouldUpdate() {
      return (
        this.collectionType === 'Combinators' ||
        this.collectionType === 'Concepts' ||
        this.component === 'Concepts'
      );
    },
  },
  roles: {
    get() {
      if (this._roles && this._roles.length > 0) {
        return this._roles;
      }
      return this.getSource('users-permissions/roles', 'roles').then(
        (roles) => {
          this._roles = roles;
          return this._roles;
        }
      );
    },
    shouldUpdate() {
      return this.component === 'Users';
    },
  },
};

const data = function () {
  return {
    deleteModal: false,
    itemToDelete: [],
    currentPage: 1,
    perPage: 10,
    limits: [10, 20, 50, 100],
    currentId: '',
    currentDatasetId: '',
    datasets: [],
    features: [],
    mapLayers: [],
    categories: [],
    temporalCoverages: [],
    topicMaps: [],
    currentDataset: {},
    currentCombinator: null,
    currentFieldsPage: 1,
    currentCombinatorsPage: 1,
    currentFieldsLimit: 10,
    currentCombinatorsLimit: 10,
    start: 0,
    filter: '',
    filteredFeatures: [],
    loading: true,
    rows: 0,
  };
};

export default {
  apollo,
  methods,
  asyncComputed,
  data,
  components: {
    TableViewLayout,
  },
};
