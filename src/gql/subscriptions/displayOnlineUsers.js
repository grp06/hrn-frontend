import gql from 'graphql-tag'

const displayOnlineUsers = gql`
  subscription displayOnlineUsers($event_id: Int!) {
    event_users(where: { event_id: { _eq: $event_id } }, order_by: { user: { name: asc } }) {
      user {
        id
        updated_at
        name
        profile_pic_url
      }
    }
  }
`

export default displayOnlineUsers
