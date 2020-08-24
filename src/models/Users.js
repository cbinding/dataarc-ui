class Users {
  constructor(data) {
    this.id = data.id
    this.username = data.username
    this.email = data.email
    this.password = data.password
    this.provider = data.provider
    this.confirmed = data.confirmed
    this.blocked = data.blocked
    this.role = data.role
    this.createUrl = `${process.env.VUE_APP_STRAPI_API_URL}/auth/local/register`
    this.editUrl = `${process.env.VUE_APP_STRAPI_API_URL}/users/${this.id}`
    this.routeUrl = '/admin/users/index'
  }

  _create = async () => {
    try {
      const resp = await axios.post(this.createUrl, this)
      return resp
    } catch (err) {
      console.log(err)
    }
  }

  _update = async () => {
    try {
      const resp = await axios.put(this.editUrl, this)
      return resp
    } catch (err) {
      console.log(err)
    }
  }

  _delete = async () => {
    try {
      const resp = await axios.delete(`${process.env.VUE_APP_STRAPI_API_URL}/users/${this.id}`)
      return 'users'
    } catch (err) {
      console.log(err)
    }
  }
}

// statics

Users.fillable = [
  'username',
  'email',
  'password',
  'provider',
  'confirmed',
  'blocked',
  'role',
]

Users.isAttributeFillable = function (attr) {
  return (Users.fillable.indexOf(attr) > -1);
}

export default Users
