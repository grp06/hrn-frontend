import gql from 'graphql-tag'

const deleteUsersTags = gql`
  mutation deleteUsersTags($user_id: Int!) {
    delete_tags_users(where: { user_id: { _eq: $user_id } }) {
      returning {
        user {
          id
          name
          role
          email
          city
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
  }
`
export default deleteUsersTags
