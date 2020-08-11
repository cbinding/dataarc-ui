class Combinators {

  constructor(data) {
    this.id = data.id
    this.title = data.title
    this.description = data.description
    this.citation = data.citation
    this.operator = data.operator
    this.dataset = data.dataset
    this.queries = data.queries
    this.concepts = data.concepts
    this.features = data.features
    this.createUrl = `${process.env.VUE_APP_STRAPI_API_URL}/combinators`
    this.editUrl = `${process.env.VUE_APP_STRAPI_API_URL}/combinators/${this.id}`
    this.routeUrl = '/contributor/combinators'
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
      const resp = await axios.delete(`${process.env.VUE_APP_STRAPI_API_URL}/combinators/${this.id}`)
      return 'combinators'
    } catch (err) {
      console.log(err)
    }
  }

}

// statics

Combinators.fillable = [
  'title',
  'description',
  'citation',
  'operator',
  'queries',
  'concepts',
  'dataset',
  'features']

Combinators.isAttributeFillable = function (attr) {
 return (Combinators.fillable.indexOf(attr) > -1);
}

export default Combinators
