import Cookies from 'js-cookie'

export default function authHeader() {
  // return authorization header with jwt token
  const jwt = Cookies.get('jwt')

  if (jwt) {
    return { Authorization: `Bearer ${jwt}` }
  }
  return {}
}
