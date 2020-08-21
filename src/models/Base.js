class Base {
  static indexKey = false

  static baseUrl = `${process.env.VUE_APP_STRAPI_API_URL}`

  static className = 'Base'

  constructor(data) {
    Object.assign(this, data)
  }

  get resourceUrl() {
    // Computed url property
    return `${this.baseUrl}/${this.id}`
  }

  _create = async () => {
    if (this.inArray('create', this.actions)) {
      return axios.post(this.resourceUrl, this)
    }
  }

  _update = async () => {
    if (this.inArray('edit', this.actions)) {
      return axios.put(this.resourceUrl, this)
    }
  }

  _delete = async () => {
    if (this.inArray('delete', this.actions)) {
      return axios.delete(this.resourceUrl, this)
    }
  }

  refresh = async () => {
    const response = axios.get(this.resourceUrl)
    return this.make(response.data)
  }

  inArray = function (item, collection) {
    return _.find(collection, (o) => {
      return o === item
    })
  }

  static all = async function () {
    return axios.get(this.baseUrl)
    .then(({ data }) => {
      return data[this.indexKey].map((item) => {
        return this.make(item)
      })
    })
  }

  static make = function (data) {
    return new this(data)
  }

  static isAttributeFillable = function (attr) {
    return (this.fillable.indexOf(attr) > -1)
  }
}

export default Base
