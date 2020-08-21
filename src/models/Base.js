class Base {
  static indexKey = false

  static baseUrl = `${process.env.VUE_APP_STRAPI_API_URL}`

  static resourcePath = ''

  static className = 'Base'

  constructor(data) {
    Object.assign(this, data)
  }

  get documentUrl() {
    // Computed url property
    return this.documentUrlConstructor(this.id)
  }

  update = async () => {
    if (this.inArray('edit', this.actions)) {
      return axios.put(this.documentUrl, this)
    }
  }

  delete = async () => {
    if (this.inArray('delete', this.actions)) {
      return axios.delete(this.documentUrl, this)
    }
  }

  fresh = async () => {
    return this.fetch(this.id)
  }

  static get resourceUrl() {
    return `${this.baseUrl}/${this.resourcePath}`
  }

  static create = async (postData) => {
    if (this.inArray('create', this.actions)) {
      return axios.post(this.baseUrl, postData).then(({ data }) => {
        return this.make(data)
      })
    }
  }

  static documentUrlConstructor = function (resourceId) {
    return `${this.resourceUrl}/${resourceId}`
  }

  static fetch = async function (id) {
    return axios.get(this.documentUrlConstructor(id))
    .then(({ data }) => {
      return this.make(data)
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

  static isActionAllowed = function (action) {
    return (this.actions.indexOf(action) > -1)
  }

  static make = function (data) {
    return new this(data)
  }

  static isAttributeFillable = function (attr) {
    return (this.fillable.indexOf(attr) > -1)
  }
}

export default Base
