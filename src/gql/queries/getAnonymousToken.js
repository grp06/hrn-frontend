import gql from 'graphql-tag'

const getEventById = gql`
  query getAnonymousToken {
    getAnonymousToken {
      token
    }
  }
`

export default getEventById
