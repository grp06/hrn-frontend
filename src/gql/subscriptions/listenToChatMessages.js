import gql from 'graphql-tag'

const listenToChatMessages = gql`
  subscription displayChatsWithPartner($user_id: Int!, $partner_id: Int!) {
    personal_chat_messages(
      where: {
        _and: [
          { _or: [{ sender_id: { _eq: $user_id } }, { sender_id: { _eq: $partner_id } }] }
          { _or: [{ recipient_id: { _eq: $user_id } }, { recipient_id: { _eq: $partner_id } }] }
        ]
      }
      order_by: { created_at: asc }
    ) {
      content
      created_at
      id
      read
      recipient {
        id
        first_name
        last_name
      }
      sender_id
      recipient_id
      user {
        first_name
        last_name
        id
      }
    }
  }
`

export default listenToChatMessages
