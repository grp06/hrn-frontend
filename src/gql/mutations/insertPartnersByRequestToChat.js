import gql from 'graphql-tag'

const insertPartnersByRequestToChat = gql`
  mutation insertPartnersByRequestToChat(
    $event_id: Int!
    $partner_id: Int!
    $round: Int!
    $user_id: Int!
  ) {
    insert_partners(
      objects: {
        chat_request: "pending"
        event_id: $event_id
        partner_id: $partner_id
        round: $round
        user_id: $user_id
      }
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
export default insertPartnersByRequestToChat
