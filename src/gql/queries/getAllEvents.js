import gql from 'graphql-tag'

const getAllEvents = gql`
  query getAllEvents {
    events {
      event_users {
        user {
          first_name
          last_name
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
        round
        user {
          first_name
          last_name
          id
          email
        }
        partner {
          first_name
          last_name
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
        first_name
        last_name
        linkedIn_url
      }
    }
  }
`

export default getAllEvents
