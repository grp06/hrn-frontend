import gql from 'graphql-tag'

const listenToOnlineEventUsers = gql`
  subscription listenToOnlineEventUsers($event_id: Int!) {
    online_users(where: { event_users: { event_id: { _eq: $event_id } } }) {
      id
      city
      name
    }
  }
`

export default listenToOnlineEventUsers
