import gql from 'graphql-tag'

const setRoundToZero = gql`
  mutation insertEventUser($eventId: Int!, $userId: Int!) {
    insert_event_users(objects: { event_id: $eventId, user_id: $userId }) {
      returning {
        id
      }
    }
  }
`
export default setRoundToZero
