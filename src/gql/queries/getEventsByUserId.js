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
        start_at
        round_length
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
