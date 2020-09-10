import Base from '@/models/Base'
import Category from '@/models/Category'
import gql from 'graphql-tag'

class Dataset extends Base {
  static indexKey = 'datasets'

  static resourcePath = 'datasets'

  static actions = ['create', 'edit', 'delete']

  static fillable = ['name', 'title', 'description', 'citation', 'state', 'state_msg', 'state_at']

  static public = ['name', 'title', 'description', 'citation', 'state', 'state_msg', 'state_at']

  static hasMany = [
    {
      relation: 'datasets',
      model: Dataset
    },
  ]

  static gqlAllQuery = {
    query: gql`
      query {
        datasets {
          id
          name
          title
          description
          citation
          state
          state_msg
          state_at
        }
      }
    `,
  }

  static gqlFetchQuery = {
    query: gql`
      query datasetById($id: ID!) {
        dataset(id: $id) {
          id
          name
          title
          description
          citation
          url
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
            path
          }
          features{
            title
            properties
          }
        }
      }
    `,
    variables: {
      id: '',
    },
  }

  async process() {
    return axios.get(`${this.documentUrlConstructor}/process`)
  }

  get fieldsCount () {
    return this.fields ? this.fields.length : 0
  }

  get featuresCount () {
    return this.features ? this.features.length : 0
  }
}

export default Dataset
