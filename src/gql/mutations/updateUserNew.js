import gql from 'graphql-tag'

const updateUserNew = gql`
  mutation updateUserNew($id: Int!, $changes: users_new_set_input) {
    update_users_new(where: { id: { _eq: $id } }, _set: $changes) {
      affected_rows
      returning {
        name
        email
        cash_app
        venmo
      }
    }
  }
`
export default updateUserNew
