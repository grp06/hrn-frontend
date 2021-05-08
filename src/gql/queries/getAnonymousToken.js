import gql from 'graphql-tag'

const getAnonymousToken = gql`
  query getAnonymousToken {
    getAnonymousToken {
      token
    }
  }
`

export default getAnonymousToken
