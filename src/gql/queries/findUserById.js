import gql from 'graphql-tag'

const findUserById = gql`
  query findUserById($id: Int) {
    users(where: { id: { _eq: $id } }) {
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
`

export default findUserById
