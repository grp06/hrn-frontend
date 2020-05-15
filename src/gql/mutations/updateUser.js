import gql from 'graphql-tag'

const updateUser = gql`
  mutation($id: Int!, $age: Int, $name: String) {
    update_users(where: { id: { _eq: $id } }, _set: { age: $age, name: $name }) {
      affected_rows
    }
  }
`
export default updateUser
