import gql from 'graphql-tag'

const updateLastSeen = gql`
  mutation updateLastSeen($now: timestamptz, $id: Int!) {
    update_users(where: { id: { _eq: $id } }, _set: { last_seen: $now }) {
      returning {
        id
        name
        role
        email
        city
        updated_at
        tags_users {
          tag {
            name
            tag_id
            category
          }
        }
      }
    }
  }
`
export default updateLastSeen
