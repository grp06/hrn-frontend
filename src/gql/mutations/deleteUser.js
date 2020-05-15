import gql from 'graphql-tag'

const deleteUser = gql`
  mutation($id: Int!) {
    delete_users(where: { id: { _eq: $id } }) {
      affected_rows
    }
  }
`
export default deleteUser
