class DatasetFields {
  constructor(data) {
    this.id = data.id
    this.title = data.title
    this.type = data.fieldType
    this.editUrl = `${process.env.VUE_APP_STRAPI_API_URL}/dataset-fields/${this.id}`
    this.routeUrl = ''
  }

  _update = async () => {
    try {
      const resp = await axios.put(this.editUrl, this)
      return resp
    } catch (err) {
      console.log(err)
    }
  }
}

// statics
DatasetFields.fillable = [
  'title',
  'type',
]

DatasetFields.isAttributeFillable = function (attr) {
  return (DatasetFields.fillable.indexOf(attr) > -1);
}

export default DatasetFields
