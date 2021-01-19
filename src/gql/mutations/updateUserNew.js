import gql from 'graphql-tag'

const updateUserNew = gql`
  mutation updateUserNew($id: Int!, $cash_app: String, $venmo: String) {
    update_users_new(where: { id: { _eq: $id } }, _set: { cash_app: $cash_app, venmo: $venmo }) {
      returning {
        name
        cash_app
        venmo
      }
    }
  }
`
export default updateUserNew
