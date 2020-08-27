import Base from '@/models/Base'
import User from '@/models/User'
import Role from '@/models/Role'
import gql from 'graphql-tag'

class Permission extends Base {
  static indexKey = 'permissions'

  static resourcePath = 'users-permissions'

  static actions = []

  static public = ['type', 'controller']

  static hasOne = []

  static hasMany = []

  static gqlAllQuery = {
    query: gql`
      query {
        permissions {
          id
          controller
        }
      }
    `,
  }

  static gqlFetchQuery = {
    query: gql`
      query permissionById($id: ID!) {
        permission(id: $id) {
          id
          controller
        }
      }
    `,
    variables: {
      id: '',
    },
  }

}

export default Permission
