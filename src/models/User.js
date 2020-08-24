import Base from '@/models/Base'
import gql from 'graphql-tag'

class User extends Base {
  static indexKey = 'users'

  static baseUrl = `${process.env.VUE_APP_STRAPI_API_URL}/users`

  static actions = ['edit']

  static fillable = ['username', 'email', 'confirmed', 'blocked', 'role']

  static public = ['userName', 'email', 'confirmed', 'roleAssigned']

  // static hasOne = []

  // static hasMany = {
  //   'users': User,
  //   'permissions': Permission
  // }

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
