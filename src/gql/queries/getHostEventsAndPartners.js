import gql from 'graphql-tag'

const getHostEventsAndPartners = gql`
  query getHostEventsAndPartners($user_id: Int) {
    events(where: { host_id: { _eq: $user_id } }) {
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
      partners {
        user_id
        partner_id
        i_shared_details
        partner_shared_details
        round
        rating
        user {
          name
          email
        }
      }
      public_event
      num_rounds
      round_length
    }
  }
`

export default getHostEventsAndPartners
