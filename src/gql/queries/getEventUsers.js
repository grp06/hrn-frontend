import gql from 'graphql-tag'

const getEventUsers = gql`
  query getEventUsers($eventId: Int!) {
    event_users(where: { event_id: { _eq: $eventId } }) {
      event_id
      user {
        id
        last_seen
        name
        role
      }
    }
  }
`

export default getEventUsers
