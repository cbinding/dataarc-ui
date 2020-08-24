import Base from '@/models/Base'
import gql from 'graphql-tag'

class MapLayer extends Base {
  static indexKey = 'mapLayers'

  static resourcePath = 'mapLayers'

  static baseUrl = `${process.env.VUE_APP_STRAPI_API_URL}/map-layers`

  static actions = ['create', 'edit', 'delete']

  static fillable = ['name', 'title', 'description']

  static public = ['name', 'title', 'description', 'citation', 'state', 'state_msg', 'state_at']

  static hasOne = []

  static hasMany = [
    {
      relation: 'mapLayers',
      model: Dataset
    },
  ]

  static gqlAllQuery = {
    query: gql`
      query {
        mapLayers {
          id
          name
          title
          description
        }
      }
    `,
  }

  static gqlFetchQuery = {
    query: gql`
      query mapLayerById($id: ID!) {
        mapLayer(id: $id) {
          id
          name
          title
          description
        }
      }
    `,
    variables: {
      id: '',
    },
  }
}

export default MapLayer
