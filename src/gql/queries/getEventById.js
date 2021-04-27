import gql from 'graphql-tag'

const getEventById = gql`
  query getEventById($event_id: Int) {
    events(where: { id: { _eq: $event_id } }) {
      id
      host_id
      start_at
      updated_at
      description
      ended_at
      event_name
      current_round
      round_length
      num_rounds
      public_event
      group_video_chat
      banner_photo_url
      matching_type
      side_a
      side_b
      event_users {
        user {
          id
          first_name
          last_name
          updated_at
        }
      }
      host {
        first_name
        last_name
        profile_pic_url
        short_bio
      }
    }
  }
`

export default getEventById
