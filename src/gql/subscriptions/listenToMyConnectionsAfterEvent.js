import gql from 'graphql-tag'

const getMyConnectionAfterEvent = gql`
  subscription getMyConnectionAfterEvent($user_id: Int!, $event_id: Int!) {
    partners(
      where: {
        user_id: { _eq: $user_id }
        event_id: { _eq: $event_id }
        partner_shared_details: { _eq: true }
      }
    ) {
      i_shared_details
      partner_shared_details
      partner_id
      user_id
      userByPartnerId {
        city
        email
        linkedIn_url
        name
        short_bio
        tags_users {
          tag {
            name
          }
        }
      }
      id
      event_id
    }
  }
`

export default getMyConnectionAfterEvent
