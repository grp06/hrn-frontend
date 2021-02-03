import gql from 'graphql-tag'

const bulkUpsertReadPersonalChatMessage = gql`
  mutation bulkUpsertReadPersonalChatMessage($messages: [personal_chat_messages_insert_input!]!) {
    insert_personal_chat_messages(
      objects: $messages
      on_conflict: { constraint: personal_chat_messages_pkey, update_columns: [read] }
    ) {
      affected_rows
    }
  }
`
export default bulkUpsertReadPersonalChatMessage
