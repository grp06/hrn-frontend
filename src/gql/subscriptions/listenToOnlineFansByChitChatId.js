import gql from 'graphql-tag'

const listenToOnlineFansByChitChatId = gql`
  subscription listenToOnlineFansByChitChatId($chitChatId: Int!) {
    online_event_users_new(where: { event_id: { _eq: $chitChatId } }, order_by: { id: asc }) {
      id
      user_id
      updated_at
      status
    }
  }
`

export default listenToOnlineFansByChitChatId
