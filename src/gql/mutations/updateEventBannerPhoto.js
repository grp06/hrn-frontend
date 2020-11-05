import gql from 'graphql-tag'

const updateEventBannerPhoto = gql`
  mutation updateEvent($event_id: Int!, $banner_photo_url: String!) {
    update_events(
      where: { id: { _eq: $event_id } }
      _set: { banner_photo_url: $banner_photo_url }
    ) {
      returning {
        id
        event_name
        banner_photo_url
      }
    }
  }
`
export default updateEventBannerPhoto
