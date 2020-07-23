import gql from 'graphql-tag'

const updateLastSeen = gql`
  mutation updateLastSeen($now: timestamptz!, $id: Int!) {
    update_users(where: { id: { _eq: $id } }, _set: { last_seen: $now }) {
      returning {
        id
        name
        role
        email
        city
        tags_users {
          tag {
            name
            id
          }
        }
      }
    }
  }
`
export default updateLastSeen
