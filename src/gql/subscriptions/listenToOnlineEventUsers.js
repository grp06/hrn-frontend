import gql from 'graphql-tag'

const listenToOnlineEventUsers = gql`
  subscription listenToOnlineEventUsers($event_id: Int!) {
    online_event_users(where: { event_id: { _eq: $event_id } }) {
      user {
        id
        city
        name
      }
    }
  }
`

export default listenToOnlineEventUsers
