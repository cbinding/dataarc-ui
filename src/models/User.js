import Base from '@/models/Base'
import Role from '@/models/Role'
import Permission from '@/models/Role'
import gql from 'graphql-tag'
import UserForm from './forms/user.form'

class User extends Base {
  static indexKey = 'users'

  static resourcePath = 'users'

  static actions = ['edit']

  static fillable = ['username', 'email', 'confirmed', 'blocked', 'role']

  static public = ['username', 'email', 'confirmed', 'roleAssigned']

  static model = {
    'username': null,
    'email': null,
    'password': null,
    'provider': null,
    'confirmed': null,
    'blocked': null,
    'role': null,
  }

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

  static form = async () => {
    let promises = [
      Role.withApollo(this._apollo).all(),
      this.withApollo(this._apollo).all()
    ]
    return new Promise.all(promises)
      .then((data) => {
        return new UserForm(data).fields
      })
  }

}

export default User
