import gql from 'graphql-tag'

const resetPassword = gql`
  query resetPassword($email: String!) {
    resetPassword(email: $email) {
      success
    }
  }
`

export default resetPassword
