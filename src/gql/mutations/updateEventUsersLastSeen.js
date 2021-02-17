import gql from 'graphql-tag'

const updateEventUsersLastSeen = gql`
  mutation updateEventUsersLastSeen($now: timestamptz, $user_id: Int!, $event_id: Int!) {
    update_event_users(
      where: { user_id: { _eq: $user_id }, event_id: { _eq: $event_id } }
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
export default updateEventUsersLastSeen
