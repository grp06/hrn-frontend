import gql from 'graphql-tag'

const createEvent = gql`
  mutation createEvent(
    $description: String!
    $event_name: String!
    $host_id: Int!
    $start_at: timestamptz!
  ) {
    insert_events(
      objects: {
        description: $description
        event_name: $event_name
        host_id: $host_id
        start_at: $start_at
      }
    ) {
      returning {
        id
      }
    }
  }
`
export default createEvent
