import gql from 'graphql-tag'

const findUsers = gql`
  query findUsers {
    users {
      id
      name
      isInChat
    }
  }
`

export default findUsers
