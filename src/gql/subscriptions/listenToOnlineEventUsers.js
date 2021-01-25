import gql from 'graphql-tag'
// TODO seems like we return updated_at so we can use it for the timer. Maybe thats why its not accurate
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
