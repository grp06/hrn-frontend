import gql from 'graphql-tag'

const upsertChitChat = gql`
  mutation upsertChitChat($event_details: [chit_chats_insert_input!]!) {
    insert_chit_chats(
      objects: $event_details
      on_conflict: {
        constraint: chit_chats_pkey
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
