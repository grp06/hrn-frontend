import gql from 'graphql-tag'

const getLoginDetails = gql`
  query getLoginDetails($email: String!, $password: String!) {
    getLoginDetails(email: $email, password: $password) {
      id
      role
      token
    }
  }
`

export default getLoginDetails
