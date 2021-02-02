import gql from 'graphql-tag'

const insertChitChatUser = gql`
  mutation insertChitChatUser($chit_chat_id: Int!, $user_id: Int!) {
    insert_chit_chat_users(objects: { event_id: $chit_chat_id, user_id: $user_id }) {
      returning {
        id
        user_id
        event_id
        event {
          chit_chat_users {
            user_id
            status
          }
        }
      }
    }
  }
`

export default insertChitChatUser
