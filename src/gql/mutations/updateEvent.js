import gql from 'graphql-tag'

const updateEvent = gql`
  mutation updateEvent(
    $id: Int!
    $description: String
    $event_name: String
    $start_at: timestamptz
    $round_length: Int!
  ) {
    update_events(
      where: { id: { _eq: $id } }
      _set: {
        description: $description
        event_name: $event_name
        start_at: $start_at
        round_length: $round_length
      }
    ) {
      returning {
        description
        event_name
        host_id
        id
        start_at
        round_length
      }
    }
  }
`
export default updateEvent
