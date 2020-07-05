import gql from 'graphql-tag'

const updateEvent = gql`
  mutation updateEvent(
    $id: Int!
    $description: String
    $event_name: String
    $start_at: timestamptz
    $round_length: Int!
    $num_rounds: Int!
  ) {
    update_events(
      where: { id: { _eq: $id } }
      _set: {
        description: $description
        event_name: $event_name
        start_at: $start_at
        round_length: $round_length
        num_rounds: $num_rounds
      }
    ) {
      returning {
        description
        event_name
        host_id
        id
        start_at
        round_length
        num_rounds
      }
    }
  }
`
export default updateEvent
