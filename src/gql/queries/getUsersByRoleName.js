import gql from 'graphql-tag'

const getUsersByRoleName = gql`
  query getUsersByRoleName($role: String!) {
    users(where: { role: { _eq: $role } }) {
      city
      email
      name
      sub_period_end
      role
    }
  }
`

export default getUsersByRoleName
