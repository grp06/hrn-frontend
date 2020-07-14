import gql from 'graphql-tag'

const insertTags = gql`
  mutation insertTags($objects: [tags_users_insert_input!]!) {
    insert_tags_users(objects: $objects) {
      affected_rows
    }
  }
`
export default insertTags
