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
      updated_at
      event_users_new(order_by: { user: { id: asc } }) {
        status
        user {
          name
          role
          id
        }
      }
    }
  }
`

export default listenToChitChat
