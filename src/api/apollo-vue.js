import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { setContext } from 'apollo-link-context'

import authHeader from './auth-header'

// HTTP connection to the API
const httpLink = createHttpLink({
  // You should use an absolute URL here
  uri: process.env.VUE_APP_GRAPHQL_URL || 'http://localhost:1337/graphql',
})

// Cache implementation
const cache = new InMemoryCache()

const { Authorization } = authHeader()
// Create a new Middleware Link using setContext
const middlewareLink = setContext(() => {
  return {
    headers: {
      authorization: Authorization,
    },
  }
})

let link = httpLink
if (Authorization) {
  link = middlewareLink.concat(httpLink)
}


// Create the apollo client
const apolloClient = new ApolloClient({
  link,
  cache,
})

export default apolloClient
