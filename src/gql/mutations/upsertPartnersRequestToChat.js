import gql from 'graphql-tag'

const upsertPartnersRequestToChat = gql`
  mutation upsertPartnersRequestToChat($partner_row: [partners_insert_input!]!) {
    insert_partners(
      objects: $partner_row
      on_conflict: { constraint: partners_pkey, update_columns: chat_request }
    ) {
      returning {
        id
        partner_id
        user_id
        event_id
        chat_request
      }
    }
  }
`
export default upsertPartnersRequestToChat
