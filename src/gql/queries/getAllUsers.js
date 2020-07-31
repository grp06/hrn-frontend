import gql from 'graphql-tag'

const getAllUsers = gql`
  query getAllUsers {
    users {
      id
      name
      role
      created_at
    }
  }
`

export default getAllUsers
