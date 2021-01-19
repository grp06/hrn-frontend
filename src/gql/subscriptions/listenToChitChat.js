import gql from 'graphql-tag'

const listenToChitChat = gql`
  subscription listenToChitChat($event_id: Int!) {
    events_new(where: { id: { _eq: $event_id } }) {
      ended_at
      host_id
      host {
        cash_app
        email
        name
        profile_pic_url
      }
      id
      num_rounds
      round_length
      start_at
      status
      event_users_new(order_by: { user: { id: asc } }) {
        user {
          created_at
          name
          role
          id
        }
      }
    }
  }
`

export default listenToChitChat
