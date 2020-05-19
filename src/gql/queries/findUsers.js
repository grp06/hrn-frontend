import gql from 'graphql-tag'

const findUsers = gql`
  query findUsers {
    users {
      id
      name
      role
    }
  }
`

export default findUsers
