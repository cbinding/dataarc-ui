const methods = {
  getMapLayers() {
    let url = ''
    url = `${this.$baseUrl}/map-layers`
    axios
    .get(url)
    .then((response) => {
      // Handle success.
      this.mapLayers = response.data
    })
    .catch((error) => {
      // Handle error.
    })
  },
  getCategories() {
    let url = ''
    url = `${this.$baseUrl}/categories`
    axios
    .get(url)
    .then((response) => {
      // Handle success.
      this.categories = response.data
    })
    .catch((error) => {
      // Handle error.
    })
  },
  getCombinators() {
    let url = ''
    url = `${this.$baseUrl}/combinators`
    axios
    .get(url)
    .then((response) => {
      // Handle success.
      this.combinators = response.data
    })
    .catch((error) => {
      // Handle error.
    })
  },
  getFields() {
    let url = ''
    url = `${this.$baseUrl}/dataset-fields`
    axios
    .get(url)
    .then((response) => {
      // Handle success.
      this.fields = response.data
    })
    .catch((error) => {
      // Handle error.
    })
  },
  getTemplates() {
    let url = ''
    url = `${this.$baseUrl}/dataset-templates`
    axios
    .get(url)
    .then((response) => {
      // Handle success.
      this.templates = response.data
    })
    .catch((error) => {
      // Handle error.
    })
  },
  getFeatures() {
    let url = ''
    url = `${this.$baseUrl}/dataset-features`
    axios
    .get(url)
    .then((response) => {
      // Handle success.
      this.features = response.data
    })
    .catch((error) => {
      // Handle error.
    })
  },
  getDatasets() {
    axios
    .get(`${this.$baseUrl}/datasets`)
    .then((response) => {
      // Handle success.
      this.datasets = response.data
    })
    .catch((error) => {
      // Handle error.
    })
  },
  getRoles() {
    axios
    .get(`${this.$baseUrl}/users-permissions/roles`)
    .then((response) => {
      // Handle success.
      this.roles = response.data.roles
      // return response.data.roles
    })
    .catch((error) => {
      // Handle error.
    })
  },
  getEvents() {
    axios
    .get(`${this.$baseUrl}/events`)
    .then((response) => {
      // Handle success.
      this.events = response.data
      return response.data
    })
    .catch((error) => {
      // Handle error.
    })
  },
}

export default {
  methods,
};
