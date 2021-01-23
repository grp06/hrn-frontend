import gql from 'graphql-tag'

const listenToOnlineFansByEventId = gql`
  subscription listenToOnlineFansByEventId($chitChatId: Int!) {
    online_event_users_new(where: { event_id: { _eq: $chitChatId } }) {
      user_id
    }
  }
`

export default listenToOnlineFansByEventId
