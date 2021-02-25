import gql from 'graphql-tag'

const getMyRoundPartner = gql`
  query getMyRoundPartner($round: Int!, $event_id: Int!, $user_id: Int!) {
    partners(
      where: { round: { _eq: $round }, event_id: { _eq: $event_id }, user_id: { _eq: $user_id } }
      order_by: { created_at: desc }
    ) {
      event_id
      partner_id
      id
      created_at
      left_chat
      i_shared_details
      partner {
        city
        name
        tags_users {
          tag {
            name
            tag_id
            category
          }
        }
      }
      user_id
    }
  }
`

export default getMyRoundPartner
