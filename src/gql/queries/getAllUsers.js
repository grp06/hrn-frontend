import gql from 'graphql-tag'

const getAllUsers = gql`
  query getAllUsers {
    users {
      id
      first_name
      last_name
      role
      created_at
    }
  }
`

export default getAllUsers
