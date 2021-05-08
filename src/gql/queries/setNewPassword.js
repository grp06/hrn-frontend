import gql from 'graphql-tag'

const setNewPassword = gql`
  query setNewPassord($userId: Int!, $token: String!, $password: String!) {
    setNewPassword(userId: $userId, token: $token, password: $password) {
      id
      role
      token
    }
  }
`

export default setNewPassword
