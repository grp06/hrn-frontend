import gql from 'graphql-tag'

const getEventParticipants = gql`
  query getEventParticipants($eventId: Int!) {
    event_users(where: { event_id: { _eq: $eventId } }) {
      user {
        id
        last_seen
        name
        role
      }
    }
  }
`

export default getEventParticipants
