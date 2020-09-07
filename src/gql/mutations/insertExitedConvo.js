import gql from 'graphql-tag'

const insertExitedConvo = gql`
  mutation insertExitedConvo(
    $convo_started_at: timestamptz!
    $event_id: Int!
    $partner_id: Int!
    $reason: String!
    $user_id: Int!
  ) {
    insert_exited_convos(
      objects: {
        convo_started_at: $convo_started_at
        event_id: $event_id
        partner_id: $partner_id
        reason: $reason
        user_id: $user_id
      }
    ) {
      returning {
        reason
        event_id
        convo_started_at
        partner_id
      }
    }
  }
`
export default insertExitedConvo
