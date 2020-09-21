import gql from 'graphql-tag'

const getAllMyConnections = gql`
  query getAllMyConnections($user_id: Int!) {
    partners(where: { user_id: { _eq: $user_id }, partner_shared_details: { _eq: true } }) {
      userByPartnerId {
        name
        city
        email
        linkedIn_url
        short_bio
        tags_users {
          tag {
            name
          }
          user_id
        }
      }
      i_shared_details
      partner_id
      id
      event_id
    }
  }
`

export default getAllMyConnections
