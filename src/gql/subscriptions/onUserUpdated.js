import gql from 'graphql-tag'

const onUserUpdated = gql`
  subscription {
    users {
      id
      name
      age
    }
  }
`

export default onUserUpdated
