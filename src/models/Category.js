import Base from '@/models/Base'
import Dataset from '@/models/Dataset'
import gql from 'graphql-tag'

class Category extends Base {
  static indexKey = 'categories'

  static resourcePath = 'categories'

  static actions = ['create', 'edit', 'delete']

  static fillable = ['name', 'descriptoin']

  static public = ['name', 'title', 'descriptoin', 'color', 'totalDatasets']

  static hasOne = []

  static hasMany = [
    {
      relation: 'datasets',
      model: Dataset
    },
  ]

  static gqlAllQuery = {
    query: gql`
      query {
        categories {
          id
          name
          title
          description
          color
          datasets{
            title
          }
        }
      }
    `,
  }

  static gqlFetchQuery = {
    query: gql`
      query categoryById($id: ID!) {
        category(id: $id) {
          id
          name
          title
          description
          color
          datasets{
            title
          }
        }
      }
    `,
    variables: {
      id: '',
    },
  }

  get totalDatasets() {
    return this.datasets ? this.datasets.length : 0
  }
}

export default Category
