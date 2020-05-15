import gql from 'graphql-tag'

const displayOnlineUsers = gql`
  subscription displayOnlineUsers($timeOneMinAgo: timestamptz) {
    users(order_by: { name: asc }, where: { last_seen: { _gt: $timeOneMinAgo } }) {
      name
      id
      last_seen
    }
  }
`

export default displayOnlineUsers
