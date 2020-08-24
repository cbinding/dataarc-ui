import Base from '@/models/Base'
import gql from 'graphql-tag'

class Role extends Base {
  static indexKey = 'roles';

  static apiUrl = `${process.env.VUE_APP_API_URL}/users-permissions/roles`;

  static actions = ['edit'];

  static fillable = [];

  static public = ['name', 'totalUsers', 'actions'];

  // static hasOne = []

  // static hasMany = {
  //   'users': User,
  //   'permissions': Permission
  // }

  static gqlAllQuery = {
    query: gql`
      query {
        roles {
          id
          name
          description
          users {
            id
          }
        }
      }
    `,
  }

  static gqlFetchQuery = {
    query: gql`
      query roleById($id: ID!) {
        role(id: $id) {
          id
          name
          description
          users {
            id
          }
          permissions {
            id
          }
        }
      }
    `,
    variables: {
      id: '',
    },
  }

  constructor(data) {
    super(data)
  }

  get totalUsers() {
    return this.users ? this.users.length : 0
  }
}

export default Role;
