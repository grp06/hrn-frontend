import gql from 'graphql-tag'

const getMyRoundPartner = gql`
  query getMyRoundPartner($event_id: Int!, $user_id: Int!) {
    partners(
      where: { user_id: { _eq: $user_id }, event_id: { _eq: $event_id } }
      order_by: { created_at: desc }
    ) {
      event_id
      partner_id
      id
      created_at
      left_chat
      userByPartnerId {
        city
        name
        tags_users {
          tag {
            name
            tag_id
          }
        }
      }
      user_id
    }
  }
`

export default getMyRoundPartner
