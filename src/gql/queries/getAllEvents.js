import gql from 'graphql-tag'

const getAllEvents = gql`
  query getAllEvents {
    events {
      event_users {
        user {
          name
          id
          email
          city
        }
      }
      event_name
      ended_at
      current_round
      description
      rounds {
        partnerX_thumb
        partnerY_thumb
        round_number
      }
      host_id
      start_at
      status
      id
    }
  }
`

export default getAllEvents
