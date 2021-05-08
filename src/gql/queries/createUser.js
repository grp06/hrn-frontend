import gql from 'graphql-tag'

const createUser = gql`
  query createUser(
    $email: String!
    $first_name: String!
    $last_name: String!
    $password: String!
    $role: String!
  ) {
    createUser(
      email: $email
      first_name: $first_name
      last_name: $last_name
      password: $password
      role: $role
    ) {
      created_at
      email
      name
      id
      role
    }
  }
`

export default createUser
