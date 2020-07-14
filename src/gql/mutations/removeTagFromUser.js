import gql from 'graphql-tag'

const removeTagFromUser = gql`
  mutation removeTagFromUser($tag_id: Int!, $user_id: Int!) {
    delete_tags_users(where: { tag_id: { _eq: $tag_id }, _and: { user_id: { _eq: $user_id } } }) {
      affected_rows
    }
  }
`
export default removeTagFromUser
