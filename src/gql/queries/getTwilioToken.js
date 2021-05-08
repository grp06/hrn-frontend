import gql from 'graphql-tag'

const getTwilioToken = gql`
  query getTwilioToken($userId: Int!, $uniqueName: String!) {
    getTwilioToken(userId: $userId, uniqueName: $uniqueName) {
      token
    }
  }
`

export default getTwilioToken
