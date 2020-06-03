import { InMemoryCache } from 'apollo-cache-inmemory'
import ApolloClient from 'apollo-client'
import { split } from 'apollo-link'
import { setContext } from 'apollo-link-context'
import { HttpLink } from 'apollo-link-http'
import { RetryLink } from 'apollo-link-retry'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'

async function getCurrentUserToken() {
  const token = await localStorage.getItem('token')
  return token
}

const makeApolloClient = async () => {
  const httpLink = new HttpLink({
    // uri: 'https://hi-right-now.herokuapp.com/v1/graphql',
    uri: 'http://localhost:8080/v1/graphql',
  })

  const authLink = setContext(async (req, { headers }) => {
    // add in real token KEVIN
    const token = 123
    // taking out this block breaks it
    let authHeaders
    if (token) {
      console.log('authLink -> token', token)
      authHeaders = {
        authorization: `Bearer ${token}`,
        'X-Hasura-Admin-Secret': 'balibali',
      }
    }

    return {
      ...headers,
      headers: authHeaders,
    }
  })

  const httpAuthLink = authLink.concat(httpLink)

  const connectionParams = async () => {
    const token = 123
    // taking out this block doesn't affect anything
    if (token) {
      console.log('connectionParams -> token', token)
      return {
        headers: {
          authorization: `Bearer ${token}`,
          'X-Hasura-Admin-Secret': 'baliabali',
        },
      }
    }
  }

  const wsLink = new WebSocketLink({
    // uri: 'wss://hi-right-now.herokuapp.com/v1/graphql',
    uri: 'ws://localhost:8080/v1/graphql',
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
