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
    uri: 'http://localhost:8080/v1/graphql',
    // uri: 'https://hi-right-now.herokuapp.com/v1/graphql',
  })

  const authLink = setContext(async (req, { headers }) => {
    // add in real token KEVIN
    const token = 123

    let authHeaders
    if (token) {
      authHeaders = {
        authorization: `Bearer ${token}`,
        'X-Hasura-Admin-Secret': 'hirightnow',
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

    if (token) {
      return {
        headers: {
          authorization: `Bearer ${token}`,
          'X-Hasura-Admin-Secret': 'hirightnow',
        },
      }
    }
  }

  const wsLink = new WebSocketLink({
    uri: 'wss://localhost:8080/v1/graphql',
    // uri: 'wss://hi-right-now.herokuapp.com/v1/graphql',
    options: {
      reconnect: true,
      connectionParams,
    },
  })

  const retryLink = new RetryLink()

  // using the ability to split links, you can send data to each link
  // depending on what kind of operation is being sent
  const link = split(
    // split based on operation type
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
