import gql from 'graphql-tag'

// TODO instead of subscribign to event users ... I think we should be doing online_event_users
// TODO yeah, we shouldn't even use this subscription anywhere

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
