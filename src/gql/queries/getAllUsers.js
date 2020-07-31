import gql from 'graphql-tag'

const getAllUsers = gql`
  query getAllUsers {
    users {
      id
      name
      role
    }
  }
`

export default getAllUsers
