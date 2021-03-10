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
      num_rounds
      description
      partners {
        i_shared_details
        partner_shared_details
        round
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
        user_id
        partner_id
      }
      start_at
      status
      host_id
      id
      round_length
      group_video_chat
      banner_photo_url
      matching_type
      side_a
      side_b
      host {
        city
        email
        id
        name
        linkedIn_url
      }
    }
  }
`

export default getAllEvents
