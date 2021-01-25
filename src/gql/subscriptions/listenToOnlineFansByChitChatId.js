import gql from 'graphql-tag'

const listenToOnlineFansByChitChatId = gql`
  subscription listenToOnlineFansByChitChatId($chitChatId: Int!) {
    online_event_users_new(where: { event_id: { _eq: $chitChatId } }) {
      user_id
      updated_at
      event_id
      status
    }
  }
`

export default listenToOnlineFansByChitChatId
