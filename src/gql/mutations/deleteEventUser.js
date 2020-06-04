import gql from 'graphql-tag'

const deletEventUser = gql`
  mutation deleteEventUser($eventId: Int!, $userId: Int!) {
    delete_event_users(where: { event_id: { _eq: $eventId }, user_id: { _eq: $userId } }) {
      affected_rows
      returning {
        event_id
        user_id
      }
    }
  }
`
export default deletEventUser
