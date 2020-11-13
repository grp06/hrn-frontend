import gql from 'graphql-tag'

const listenToOnlineEventUsers = gql`
  subscription listenToOnlineEventUsers($event_id: Int!) {
    online_event_users(where: { event_id: { _eq: $event_id } }, order_by: { user_id: asc }) {
      user {
        id
        city
        name
        profile_pic_url
      }
    }
  }
`

export default listenToOnlineEventUsers
