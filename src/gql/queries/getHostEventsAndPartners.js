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
          id
          email
        }
        partner {
          name
          id
          email
        }
      }
      public_event
      num_rounds
      round_length
      group_video_chat
      banner_photo_url
      matching_type
      side_a
      side_b
    }
  }
`

export default getHostEventsAndPartners
