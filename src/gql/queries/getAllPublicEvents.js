import gql from 'graphql-tag'

const getAllPublicEvents = gql`
  query getAllPublicEvents {
    events(where: { public_event: { _eq: true } }) {
      description
      current_round
      ended_at
      event_name
      host_id
      host
      id
      public_event
      start_at
      status
      group_video_chat
      banner_photo_url
      host {
        name
        profile_pic_url
      }
    }
  }
`

export default getAllPublicEvents
