import gql from 'graphql-tag'

const findMyUser = gql`
  query findMyUser($id: Int) {
    users(where: { id: { _eq: $id } }) {
      id
      name
      role
    }
  }
`

export default findMyUser
