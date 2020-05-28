import gql from 'graphql-tag'

const updateLastSeen = gql`
  mutation updateEvent(
    $id: Int!
    $description: String
    $event_name: String
    $start_at: timestamptz
  ) {
    update_events(
      where: { id: { _eq: $id } }
      _set: { description: $description, event_name: $event_name, start_at: $start_at }
    ) {
      returning {
        description
        event_name
        host_id
        id
        start_at
      }
    }
  }
`
export default updateLastSeen
