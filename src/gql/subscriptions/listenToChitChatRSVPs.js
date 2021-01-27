import gql from 'graphql-tag'

const listenToChitChatRSVPs = gql`
  subscription listenToChitChatRSVPs($chitChatId: Int!) {
    chit_chat_users(where: { event_id: { _eq: $chitChatId } }, order_by: { id: asc }) {
      user_id
      status
      id
      user {
        name
      }
    }
  }
`

export default listenToChitChatRSVPs
