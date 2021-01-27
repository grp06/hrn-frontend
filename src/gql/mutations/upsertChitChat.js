import gql from 'graphql-tag'

const upsertChitChat = gql`
  mutation upsertChitChat($event_details: [events_new_insert_input!]!) {
    insert_events_new(
      objects: $event_details
      on_conflict: {
        constraint: events_new_pkey
        update_columns: [num_rounds, round_length, start_at, suggested_donation]
      }
    ) {
      returning {
        host_id
        id
        num_rounds
        round_length
        start_at
        suggested_donation
      }
    }
  }
`
export default upsertChitChat
