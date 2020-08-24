class Base {
  static indexKey = false;

  static apiUrl = `${process.env.VUE_APP_API_URL}`;

  static resourcePath = '';

  static className = 'Base';

  static gqlAllQuery = false

  static gqlFetchQuery = false

  static _apollo = false

  // Format is {relation: String, model: T<Base>}
  static hasOne = []

  static hasMany = [
    {
      relation: 'users',
      model: User
    },
    {
      relation: 'permission',
      model: Permission
    }
  ]

  constructor(data) {
    Object.assign(this, data);
  }

  get formData () {
    const formData = {
      id: this.id
    }
    for (let index = 0; index < this.fillable.length; index++) {
      const fillableKey = this.fillable[index];
      if (this.hasOwnProperty(fillableKey)) {
        formData[fillableKey] = this[fillableKey]
      }
    }
  }

  get documentUrl() {
    // Computed url property
    return this.documentUrlConstructor(this.id);
  }

  static get resourceUrl() {
    return `${this.baseUrl}/${this.resourcePath}`
  }

  static documentUrlConstructor = function (resourceId) {
    return `${this.resourceUrl}/${resourceId}`
  }

  fresh = async () => {
    return this.fetch(this.id)
  }

  // CRUD METHODS
  update = async () => {
    if (this.isActionAllowed('edit')) {
      return axios.put(this.documentUrl, this.formData)
    }
  };

  delete = async () => {
    if (this.isActionAllowed('delete')) {
      return axios.delete(this.documentUrl)
    }
  };

  static make = function (data) {
    return new this(data)
  }

  static create = async (postData) => {
    if (this.isActionAllowed('create')) {
      return axios.post(this.baseUrl, postData).then(({ data }) => {
        return this.make(data)
      })
    }
  };

  static fetch = async function (id) {
    if (this._apollo) return this.gqlFetch(id)

    return axios.get(this.documentUrlConstructor(id))
    .then(({ data }) => {
      return this.make(data)
    })
  }

  static all = async function () {
    if (this._apollo) return this.gqlAll()

    return axios.get(this.baseUrl)
    .then(({ data }) => {
      return data.map((item) => {
        return this.make(item)
      })
    })
  }

  static withApollo = function (apolloInstance) {
    this._apollo = apolloInstance
    return this
  }

  // Requires this._apollo to be set
  // Usually set by the helper method Base.withApollo($apolloInstance)
  static gqlFetch = async function (id) {
    const fetchString = this.gqlFetchQuery
    fetchString.variables.id = id
    return this._apollo.query(fetchString).then(({ data }) => {
      return this.make(data.role)
    })
  }

  static gqlAll = function () {
    return this._apollo
    .query(this.gqlAllQuery)
    .then(({ data }) => {
      console.log(data)
      return data[this.indexKey].map((item) => {
        return this.make(item)
      })
    })
  }

  static isActionAllowed = function (action) {
    return this.actions.indexOf(action) > -1;
  };

  static isAttributeFillable = function (attr) {
    return this.fillable.indexOf(attr) > -1;
  };
}

export default Base;
