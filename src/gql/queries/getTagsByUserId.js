import gql from 'graphql-tag'

const getTagsByUserId = gql`
  query getTagsByUserId($user_id: Int!) {
    tags_users(where: { user_id: { _eq: $user_id } }) {
      tag {
        name
        id
      }
    }
  }
`

export default getTagsByUserId
