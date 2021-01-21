import gql from 'graphql-tag'

const updateUserNew = gql`
  mutation updateUserNew(
    $cash_app: String
    $email: String!
    $id: Int!
    $name: String!
    $venmo: String
  ) {
    update_users_new(
      where: { id: { _eq: $id } }
      _set: { cash_app: $cash_app, email: $email, name: $name, venmo: $venmo }
    ) {
      returning {
        cash_app
        email
        id
        name
        venmo
      }
    }
  }
`
export default updateUserNew
