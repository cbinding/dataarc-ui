import Base from '@/models/Base'
import Role from '@/models/Role'
import Permission from '@/models/Role'
import gql from 'graphql-tag'

class User extends Base {
  static indexKey = 'users'

  static baseUrl = `${process.env.VUE_APP_STRAPI_API_URL}`

  static resourcePath = 'users'

  static actions = ['edit']

  static fillable = ['username', 'email', 'confirmed', 'blocked', 'role']

  static public = ['userName', 'email', 'confirmed', 'roleAssigned']

  static hasOne = [
    {
      relation: 'role',
      model: Role
    },
  ]

  static hasMany = [
    {
      relation: 'permission',
      model: Permission
    }
  ]

  static gqlAllQuery = {
    query: gql`
      query {
        users {
          id
          username
          role {
              id
              name
              type
          }
          confirmed
        }
      }
    `,
  }

  static gqlFetchQuery = {
    query: gql`
      query userById($id: ID!) {
        user(id: $id) {
          id
          username
          role {
              id
              name
              type
          }
          confirmed
        }
      }
    `,
    variables: {
      id: '',
    },
  }

  get roleAssigned() {
    return this.hasOwnProperty('role') ? this.role.name : 'Unknown'
  }

  get schema() {

  }
}

export default User
