import Base from '@/models/Base'

class Role extends Base {
  static indexKey = 'roles'

  static baseUrl = `${process.env.VUE_APP_STRAPI_API_URL}/users-permissions/roles`

  static actions = ['edit']

  static fillable = []

  static public = ['name', 'totalUsers', 'actions']

  constructor(data) {
    super(data)
    this.totalUsers = this.nb_users ? this.nb_users : 0
  }
}

export default Role
