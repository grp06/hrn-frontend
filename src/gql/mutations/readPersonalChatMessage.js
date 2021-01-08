import gql from 'graphql-tag'

const readPersonalChatMessage = gql`
  mutation readPersonalChatMessage($message_id: Int!, $recipient_id: Int!) {
    update_personal_chat_messages(
      where: { id: { _eq: $message_id }, recipient_id: { _eq: $recipient_id } }
      _set: { read: true }
    ) {
      affected_rows
    }
  }
`
export default readPersonalChatMessage
