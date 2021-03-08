import gql from 'graphql-tag'

const getHostEventsAndRounds = gql`
  query getHostEventsAndRounds($userId: Int) {
    events(where: { host_id: { _eq: $userId } }) {
      ended_at
      event_name
      event_users {
        user {
          id
          name
          email
        }
      }
      id
      start_at
      status
      round_length
      num_rounds
      public_event
      rounds {
        partnerY_id
        partnerX_id
        partnerX_thumb
        partnerY_thumb
        round_number
        partnerX {
          name
          email
        }
        partnerY {
          email
          name
        }
      }
    }
  }
`

export default getHostEventsAndRounds
