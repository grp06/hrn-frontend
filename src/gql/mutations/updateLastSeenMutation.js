import gql from 'graphql-tag'

const updateLastSeenMutation = gql`
  mutation updateLastSeen($now: timestamptz!, $id: Int!) {
    update_users(where: { id: { _eq: $id } }, _set: { last_seen: $now }) {
      returning {
        id
        isInChat
        last_seen
        name
      }
    }
  }
`
export default updateLastSeenMutation
