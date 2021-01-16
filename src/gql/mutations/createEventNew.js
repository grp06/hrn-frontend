import gql from 'graphql-tag'

const createEventNew = gql`
  mutation createEventNew(
    $host_id: Int!
    $num_rounds: Int!
    $round_length: Int!
    $start_at: timestamptz!
  ) {
    insert_events_new(
      objects: {
        host_id: $host_id
        num_rounds: $num_rounds
        round_length: $round_length
        start_at: $start_at
      }
    ) {
      returning {
        id
      }
    }
  }
`
export default createEventNew
