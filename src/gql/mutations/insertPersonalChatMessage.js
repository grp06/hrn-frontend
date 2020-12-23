import gql from 'graphql-tag'

const insertPersonalChatMessage = gql`
  mutation insertPersonalChatMessage($user_id: Int!, $partner_id: Int!, $content: String!) {
    insert_personal_chat_messages(
      objects: { content: $content, recipient_id: $partner_id, sender_id: $user_id }
    ) {
      affected_rows
    }
  }
`
export default insertPersonalChatMessage
