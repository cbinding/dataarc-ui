import Cookie from 'js-cookie'

export default function authHeader() {
  // return authorization header with jwt token
  const jwt = Cookie.get('jwt')

  if (jwt) {
    return { Authorization: `Bearer ${jwt}` }
  }
  return {}
}
