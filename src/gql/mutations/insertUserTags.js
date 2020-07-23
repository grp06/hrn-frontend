import gql from 'graphql-tag'

const insertUserTags = gql`
  mutation insertUserTags($objects: [tags_users_insert_input!]!) {
    insert_tags_users(objects: $objects) {
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
              id
            }
          }
        }
      }
    }
  }
`
export default insertUserTags
