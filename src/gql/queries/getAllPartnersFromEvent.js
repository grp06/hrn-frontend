import gql from 'graphql-tag'

const getAllPartnersFromEvent = gql`
  query getAllPartnersFromEvent($event_id: Int!, $user_id: Int!) {
    partners(
      where: {
        event_id: { _eq: $event_id }
        user_id: { _eq: $user_id }
        partner_id: { _is_null: false }
      }
    ) {
      partner_id
      user_id
      partner {
        city
        email
        linkedIn_url
        name
        short_bio
        profile_pic_url
        tags_users {
          tag {
            name
            tag_id
          }
        }
      }
      id
      event_id
    }
  }
`

export default getAllPartnersFromEvent
