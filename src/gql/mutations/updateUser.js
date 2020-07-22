import gql from 'graphql-tag'

const updateUser = gql`
  mutation($id: Int!, $city: String!, $name: String!) {
    update_users(where: { id: { _eq: $id } }, _set: { city: $city, name: $name }) {
      returning {
        name
        city
      }
    }
  }
`
export default updateUser
