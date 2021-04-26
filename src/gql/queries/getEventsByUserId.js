import gql from 'graphql-tag'

const getEventsByUserId = gql`
  query getEventUsersByUserId($userId: Int!) {
    event_users(where: { user_id: { _eq: $userId } }) {
      event {
        start_at
        ended_at
        id
        description
        status
        event_name
        host_id
        current_round
        updated_at
        round_length
        num_rounds
        public_event
        group_video_chat
        banner_photo_url
        matching_type
        event_users {
          user {
            id
            first_name
            last_name
          }
        }
        host {
          first_name
          last_name
          profile_pic_url
        }
      }
    }
  }
`

export default getEventsByUserId
