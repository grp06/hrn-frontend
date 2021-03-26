import gql from 'graphql-tag'

const getPendingChatRequestsForPartner = gql`
  query getPendingChatRequestsForPartner($event_id: Int!, $round: Int!, $user_id: Int!) {
    partners(
      where: {
        _or: [{ chat_request: { _eq: "pending" } }, { chat_request: { _eq: "request-sent" } }]
        event_id: { _eq: $event_id }
        round: { _eq: $round }
        user_id: { _eq: $user_id }
      }
    ) {
      event_id
      id
      partner_id
      round
      user_id
    }
  }
`

export default getPendingChatRequestsForPartner
