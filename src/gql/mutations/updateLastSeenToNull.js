import gql from 'graphql-tag'

const updateLastSeenToNull = gql`
  mutation updateLastSeenToNull($userId: Int!) {
    update_event_users(where: { id: { _eq: $userId } }, _set: { last_seen: null }) {
      returning {
        updated_at
      }
    }
  }
`
export default updateLastSeenToNull
