import gql from 'graphql-tag'

const listenToPartnersTable = gql`
  subscription listenToPartnersTable($event_id: Int!, $round: Int, $user_id: Int!) {
    partners(
      where: {
        event_id: { _eq: $event_id }
        user_id: { _eq: $user_id }
        round: { _eq: $round }
        left_chat: { _is_null: true }
        partner_id: { _is_null: false }
      }
    ) {
      id
      event_id
      created_at
      partner {
        city
        name
        tags_users {
          tag {
            tag_id
            name
          }
        }
      }
      user_id
      round
      partner_id
    }
  }
`

export default listenToPartnersTable
