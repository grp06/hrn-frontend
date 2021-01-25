import gql from 'graphql-tag'

const listenToChitChatRSVPs = gql`
  subscription listenToChitChatRSVPs($chitChatId: Int!) {
    event_users_new(where: { event_id: { _eq: $chitChatId } }, order_by: { id: asc }) {
      user_id
      status
      id
    }
  }
`

export default listenToChitChatRSVPs
