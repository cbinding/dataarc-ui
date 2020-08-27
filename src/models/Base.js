class Base {

  // CLASS PROPERTIES

  static indexKey = false

  static baseUrl = `${process.env.VUE_APP_API_URL}`;

  resourcePath = '';

  static className = 'Base';

  static gqlAllQuery = false

  static gqlFetchQuery = false

  static _apollo = false

  static raw_data = {}

  static model = false

  // Format is {relation: String, model: T<Base>}
  hasOne = []

  hasMany = []

  get resourceUrl() {
    return `${Base.baseUrl}/${this.resourcePath}`
  }

  documentUrlConstructor = function (resourceId) {
    return `${this.resourceUrl}/${resourceId}`
  }

  // INSTANCE CONSTRUCTOR

  constructor(data) {
    console.log('Base: constructor(data)')
    if (!this.raw_data) {
      this.raw_data = data
    }
    else {
      this.raw_data = Object.assign(this.raw_data, data)
    }
    // Object.assign(this.raw_data, data)

    const remainingData = this._compileRelationships(data)

    Object.assign(this, remainingData)

  }

  // PUBLIC INSTANCE PROPERTIES

  get documentUrl() {
    console.log('Base: get documentUrl()')
    // Computed url property
    return this.documentUrlConstructor(this.id);
  }

  // PUBLIC INSTANCE METHODS

  model () {
    console.log('Base: model()')
    if (!this.id) return this.model

    const model = {
      id: this.id
    }

    const fields = this.model ? this.model.keys() : this.fillable

    for (let index = 0; index < fields.length; index++) {
      const fieldKey = fields[index];
      if (this.hasOwnProperty(fieldKey)) {
        model[fieldKey] = this[fieldKey]
      }
    }

    return model
  }

  fresh = async () => {
    console.log('Base: fresh()')
    return this.fetch(this.id)
  }

  // CRUD METHODS
  update = async () => {
    console.log('Base: update()')
    if (this.isActionAllowed('edit')) {
      return axios.put(this.documentUrl, this.formData)
    }
  };

  delete = async () => {
    console.log('Base: delete()')
    if (this.isActionAllowed('delete')) {
      return axios.delete(this.documentUrl)
    }
  };

  // PUBLIC CLASS METHODS

  static make = function (data) {
    console.log('Base: make()')
    console.log(data)
    return new this(data)
  }

  static create = async (postData) => {
    console.log('Base: create()')
    if (this.isActionAllowed('create')) {
      return axios.post(Base.baseUrl, postData).then(({ data }) => {
        return this.make(data)
      })
    }
  };

  static fetch = async function (id) {
    console.log('Base: fetch()')
    if (this._apollo) return this.gqlFetch(id)

    return axios.get(this.documentUrlConstructor(id))
    .then(({ data }) => {
      return this.make(data)
    })
  }

  static all = async function () {
    console.log('Base: all()')
    if (this._apollo) return this.gqlAll()

    return axios.get(Base.baseUrl)
    .then(({ data }) => {
      return data.map((item) => {
        return this.make(item)
      })
    })
  }

  static withApollo = function (apolloInstance) {
    console.log('Base: withApollo()')
    this._apollo = apolloInstance
    return this
  }

  // Requires this._apollo to be set
  // Usually set by the helper method Base.withApollo($apolloInstance)
  static gqlFetch = async function (id) {
    console.log('Base: gqlFetch()')
    const fetchString = this.gqlFetchQuery
    fetchString.variables.id = id
    return this._apollo.query(fetchString).then(({ data }) => {
      return this.make(data.role)
    })
  }

  static gqlAll = function () {
    console.log('Base: gqlAll()')
    return this._apollo
    .query(this.gqlAllQuery)
    .then(({ data }) => {
      console.log(data)
      // console.log(this.indexKey)
      return data[this.indexKey].map((item) => {
        // console.log(item)
        return this.make(item)
      })
    })
  }

  static isActionAllowed = function (action) {
    console.log('Base: isActionAllowed()')
    return this.actions.indexOf(action) > -1;
  };

  static isAttributeFillable = function (attr) {
    console.log('Base: isAttributeFillable()')
    return (this.fillable.indexOf(attr) > -1)
  }

  // PRIVAITE METHODS
  _compileRelationships (data) {
    console.log('Base: _compileRelationships()')
    const remainingData = this._compileHasManyRelations(data)
    console.log('remainingData')
    console.log(remainingData)
    return this._compileHasOneRelations(remainingData)
  }

  _compileHasOneRelations (data) {
    console.log('Base: _compileHasOneRelations()')
    for (let relatedIndex = 0; relatedIndex < this.hasOne.length; relatedIndex++) {

      // Get connection definition
      const {relation, model} = this.hasOne[relatedIndex];

      if (data.hasOwnProperty(relation)) {
        // Convert into our model
        this[relation] = new model(data[relation][attachedIndex])

        // Remove the key
        delete data[relation]
      }

    }
    return data
  }

  _compileHasManyRelations (data) {
    console.log('Base: _compileHasManyRelations()')
    console.log(data)
    console.log(this)
    for (let relatedIndex = 0; relatedIndex < this.hasMany.length; relatedIndex++) {

      // Get connection definition
      const {relation, model} = this.hasMany[relatedIndex];

      if (data.hasOwnProperty(relation)) {
        // Make the empty many relation
        this[relation] = []

        for (let attachedIndex = 0; attachedIndex < data[relation].length; attachedIndex++) {
          // Push our formatted instance
          this[relation].push(
            new model(data[relation][attachedIndex])
          )
        }

        // Remove the key
        delete data[relation]
      }

    }
    return data
  }
}

export default Base;
