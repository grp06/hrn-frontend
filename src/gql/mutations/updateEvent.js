import gql from 'graphql-tag'

const updateEvent = gql`
  mutation updateEvent(
    $id: Int!
    $description: String
    $event_name: String
    $start_at: timestamptz
    $round_length: Int!
    $num_rounds: Int!
    $post_event_link: String
    $public_event: Boolean!
  ) {
    update_events(
      where: { id: { _eq: $id } }
      _set: {
        description: $description
        event_name: $event_name
        start_at: $start_at
        round_length: $round_length
        num_rounds: $num_rounds
        post_event_link: $post_event_link
        public_event: $public_event
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
        post_event_link
        public_event
      }
    }
  }
`
export default updateEvent
