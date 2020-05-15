import gql from 'graphql-tag'

const createUser = gql`
  mutation create_user($name: String!) {
    insert_users(objects: { name: $name }) {
      returning {
        id
        isInChat
        name
      }
    }
  }
`
export default createUser
