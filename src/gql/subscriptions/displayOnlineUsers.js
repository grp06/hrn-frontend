import gql from 'graphql-tag'

const displayOnlineUsers = gql`
  subscription displayOnlineUsers {
    users {
      name
      id
      last_seen
    }
  }
`

export default displayOnlineUsers
