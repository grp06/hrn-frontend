import gql from 'graphql-tag'

const insertEventChatMessage = gql`
  mutation insertEventChatMessage($user_id: Int!, $event_id: Int!, $content: String!) {
    insert_event_group_chat_messages(
      objects: { content: $content, event_id: $event_id, sender_id: $user_id }
    ) {
      affected_rows
    }
  }
`
export default insertEventChatMessage
