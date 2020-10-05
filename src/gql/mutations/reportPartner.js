import gql from 'graphql-tag'

const reportPartner = gql`
  mutation reportPartner(
    $user_id: Int!
    $partner_id: Int!
    $reason: String!
    $event_id: Int!
    $convo_started_at: timestamptz!
  ) {
    insert_reported_users(
      objects: {
        user_id: $user_id
        partner_id: $partner_id
        reason: $reason
        event_id: $event_id
        convo_started_at: $convo_started_at
      }
    ) {
      affected_rows
    }
  }
`
export default reportPartner
