import gql from 'graphql-tag'

const getEventsByUserId = gql`
  query getEventUsersByUserId($userId: Int!) {
    event_users(where: { user_id: { _eq: $userId } }) {
      event {
        start_at
        ended_at
        id
        description
        event_name
        host_id
        current_round
        updated_at
        round_length
        num_rounds
        post_event_link
        public_event
        event_users {
          user {
            id
            name
          }
        }
      }
    }
  }
`

export default getEventsByUserId
