import gql from 'graphql-tag'

const getMyRoundPartner = gql`
  query getMyRoundPartner($round: Int!, $event_id: Int!, $user_id: Int!) {
    partners(
      where: {
        round: { _eq: $round }
        event_id: { _eq: $event_id }
        user_id: { _eq: $user_id }
        _or: [{ chat_request: { _is_null: true } }, { chat_request: { _eq: "accepted" } }]
      }
      order_by: { created_at: desc }
    ) {
      event_id
      partner_id
      id
      created_at
      left_chat
      partner {
        city
        first_name
        last_name
        tags_users {
          tag {
            name
            tag_id
            category
          }
        }
      }
      user_id
      chat_request
    }
  }
`

export default getMyRoundPartner
