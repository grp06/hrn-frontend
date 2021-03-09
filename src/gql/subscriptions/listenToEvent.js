import gql from 'graphql-tag'

const listenToEvent = gql`
  subscription listenToEvent($event_id: Int!) {
    events(where: { id: { _eq: $event_id } }) {
      id
      current_round
      description
      ended_at
      event_name
      host_id
      start_at
      updated_at
      status
      round_length
      num_rounds
      post_event_link
      public_event
      group_video_chat
      banner_photo_url
      matching_type
      side_a
      side_b
      event_users(order_by: { user: { name: asc } }) {
        user {
          email
          name
          city
          id
          profile_pic_url
        }
      }
      host {
        name
        profile_pic_url
        short_bio
      }
    }
  }
`

export default listenToEvent
