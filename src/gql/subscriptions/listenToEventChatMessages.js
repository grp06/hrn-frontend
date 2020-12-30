import gql from 'graphql-tag'

const listenToEventChatMessages = gql`
  subscription listentToEventChatMessages($event_id: Int!) {
    event_group_chat_messages(
      where: { event_id: { _eq: $event_id } }
      order_by: { created_at: asc }
    ) {
      content
      created_at
      sender_id
      user {
        name
      }
    }
  }
`

export default listenToEventChatMessages
