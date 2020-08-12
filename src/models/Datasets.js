class Datasets {
  constructor(data) {
    this.id = data.id
    this.title = data.title
    this.description = data.description
    this.citation = data.citation
    this.link = data.link
    this.category = data.category
    this.combinators = data.combinators
    this.fields = data.fields
    this.templates = data.templates
    this.features = data.features
    this.createUrl = `${process.env.VUE_APP_STRAPI_API_URL}/datasets`
    this.editUrl = `${process.env.VUE_APP_STRAPI_API_URL}/datasets/${this.id}`
    this.routeUrl = '/contributor/datasets'
  }

  _create = async () => {
    try {
      const resp = await axios.post(this.createUrl, this)
      return resp
    } catch (err) {
      console.log(err)
    }
  }

  _update = async () => {
    try {
      const resp = await axios.put(this.editUrl, this)
      return resp
    } catch (err) {
      console.log(err)
    }
  }

  _delete = async () => {
    try {
      const resp = await axios.delete(`${process.env.VUE_APP_STRAPI_API_URL}/datasets/${this.id}`)
      return 'datasets'
    } catch (err) {
      console.log(err)
    }
  }

}

// statics

Datasets.fillable = [
  'title',
  'description',
  'citation',
  'link',
  'category',
  'combinators',
  'fields',
  'templates',
  'features',
]

Datasets.isAttributeFillable = function (attr) {
  return (Datasets.fillable.indexOf(attr) > -1);
}

export default Datasets
