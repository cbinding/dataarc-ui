import Base from '@/models/Base'
import User from '@/models/User'
import gql from 'graphql-tag'

class Role extends Base {
  static indexKey = 'roles';

  static baseUrl = `${process.env.VUE_APP_STRAPI_API_URL}`

  static resourcePath = 'users-permissions/roles'

  static actions = ['edit']

  static fillable = ['name', 'descriptoin']

  static public = ['name', 'totalUsers', 'actions'];

  static hasOne = []

  static hasMany = [
    {
      relation: 'users',
      model: User
    },
  ]

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
            name
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

  get totalUsers() {
    return this.users ? this.users.length : 0
  }

  static makeSchema() {
    return User.withApollo(this._apollo)
    .all()
    .then((users) => {
      return {
        fields: [
          {
            type: 'input',
            inputType: 'text',
            label: 'Username*',
            model: 'username',
            visible: true,
            required: true,
          },
          {
            type: 'select',
            values: users,
            label: 'Users',
            model: 'users',
            default: false,
            selectOptions: {
              name: 'username',
            },
          },
        ],
      }
    })
  }
}

export default Role;
