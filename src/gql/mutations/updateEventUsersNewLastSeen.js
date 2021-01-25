import gql from 'graphql-tag'

const updateEventUsersNewLastSeen = gql`
  mutation updateEventUsersNewLastSeen($chitChatId: Int!, $now: timestamptz!, $user_id: Int!) {
    update_event_users_new(
      where: { user_id: { _eq: $user_id }, event_id: { _eq: $chitChatId } }
      _set: { last_seen: $now }
    ) {
      returning {
        event_id
        last_seen
        user_id
        updated_at
      }
    }
  }
`
export default updateEventUsersNewLastSeen
