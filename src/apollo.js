import { InMemoryCache } from 'apollo-cache-inmemory'
import ApolloClient from 'apollo-client'
import { split } from 'apollo-link'
import { setContext } from 'apollo-link-context'
import { HttpLink } from 'apollo-link-http'
import { RetryLink } from 'apollo-link-retry'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'

const makeApolloClient = async () => {
  const token = localStorage.getItem('token')
  console.log('process.env = ', process.env)

  // SET THIS UP TO WORK LOCALLY AND FOR DEPLOYMENT TO STAGING AND PROD
  const httpLink = new HttpLink({
    // uri: 'https://hi-right-now.herokuapp.com/v1/graphql',
    uri: process.env.REACT_APP_HASURA,
  })

  const authLink = setContext(async (req, { headers }) => {
    let authHeaders
    if (token) {
      authHeaders = {
        authorization: `Bearer ${token}`,
      }
    }

    return {
      ...headers,
      headers: authHeaders,
    }
  })

  const httpAuthLink = authLink.concat(httpLink)

  const connectionParams = async () => {
    if (token) {
      return {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    }
  }

  const wsLink = new WebSocketLink({
    // uri: 'wss://hi-right-now.herokuapp.com/v1/graphql',
    uri: process.env.REACT_APP_HASURA_WS,
    options: {
      reconnect: true,
      connectionParams,
    },
  })

  const retryLink = new RetryLink()

  const link = split(
    ({ query }) => {
      const { kind, operation } = getMainDefinition(query)
      return kind === 'OperationDefinition' && operation === 'subscription'
    },
    wsLink,
    httpAuthLink,
    retryLink
  )

  const client = new ApolloClient({
    link,
    cache: new InMemoryCache({
      addTypename: false,
    }),
  })

  return client
}

export default makeApolloClient
