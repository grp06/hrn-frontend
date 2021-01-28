import gql from 'graphql-tag'

const getChitChatsByUserId = gql`
  query getChitChatsByUserId($userId: Int!) {
    chit_chats(where: { host_id: { _eq: $userId } }, order_by: { start_at: desc }) {
      id
      ended_at
      host_id
      num_rounds
      round_length
      start_at
      status
      suggested_donation
      chit_chat_users {
        id
      }
      host {
        name
        profile_pic_url
      }
    }
  }
`

export default getChitChatsByUserId
