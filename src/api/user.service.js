import Cookies from 'js-cookie'
import authHeader from './auth-header'

export default {
  login,
  logout,
  register,
  getAll,
  getById,
  delete: _delete,
}

function login(identifier, password) {
  return axios
  .post(`${process.env.VUE_APP_STRAPI_API_URL}/auth/local`, {
    identifier,
    password,
  })
  .then((response) => {
    // Handle success.
    const { user } = response.data
    const { jwt } = response.data

    if (jwt) {
      Cookies.set('jwt', jwt)
      Cookies.set('user', user)
    }

    return user
  })
}

function logout() {
  // remove user from local storage to log user out
  Cookies.remove('user')
  Cookies.remove('jwt')
  axios.defaults.headers.common.Authorization = ''
}
function register(user) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  }

  return fetch(`${process.env.VUE_APP_STRAPI_API_URL}/auth/local/register`, requestOptions).then(handleResponse)
}

function getAll() {
  const requestOptions = {
    method: 'GET',
    headers: authHeader(),
  }

  return fetch(`${process.env.VUE_APP_STRAPI_API_URL}/users`, requestOptions).then(handleResponse)
}

function getById(id) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader(),
  }

  return fetch(`${process.env.VUE_APP_STRAPI_API_URL}/users/${id}`, requestOptions).then(handleResponse)
}


// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
  const requestOptions = {
    method: 'DELETE',
    headers: authHeader(),
  }

  return fetch(`${process.env.VUE_APP_STRAPI_API_URL}/users/${id}`, requestOptions).then(handleResponse)
}

function handleResponse(response) {
  return response.text().then((text) => {
    const data = text && JSON.parse(text)
    if (!response.ok) {
      if (response.status === 401) {
        // auto logout if 401 response returned from api
        logout()
        window.location.reload(true)
      }

      const error = (data && data.message) || response.statusText
      return Promise.reject(error)
    }

    return data
  })
}
