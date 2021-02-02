import gql from 'graphql-tag'

const getChitChatUsersByUserId = gql`
  query getChitChatUsersByUserId($userId: Int!) {
    chit_chat_users(where: { user_id: { _eq: $userId } }, order_by: { event: { start_at: desc } }) {
      id
      event_id
      status
      event {
        start_at
        round_length
        suggested_donation
        status
        ended_at
        host {
          name
        }
        id
        host_id
        num_rounds
        updated_at
      }
    }
  }
`

export default getChitChatUsersByUserId
