import gql from 'graphql-tag'

const getChitChatsByUserId = gql`
  query getChitChatsByUserId($userId: Int!) {
    events_new(where: { host_id: { _eq: $userId } }, order_by: { start_at: desc }) {
      id
      ended_at
      host_id
      num_rounds
      round_length
      start_at
      status
      suggested_donation
      event_users_new {
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
