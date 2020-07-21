import gql from 'graphql-tag'

const insertUserTags = gql`
  mutation insertUserTags($objects: [tags_users_insert_input!]!) {
    insert_tags_users(objects: $objects) {
      affected_rows
    }
  }
`
export default insertUserTags
