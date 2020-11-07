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
      rounds {
        partnerX_thumb
        partnerY_thumb
        round_number
        partnerX {
          name
          id
          email
        }
        partnerY {
          email
          id
          name
        }
        partnerX_id
        partnerY_id
      }
      host_id
      start_at
      status
      id
      round_length
      group_video_chat
      banner_photo_url
    }
  }
`

export default getAllEvents
