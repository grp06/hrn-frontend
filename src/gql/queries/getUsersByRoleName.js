import gql from 'graphql-tag'

const getUsersByRoleName = gql`
  query getUsersByRoleName($role: String!, $now: timestamptz) {
    users(where: { _and: [{ role: { _eq: $role } }, { sub_period_end: { _gt: $now } }] }) {
      city
      email
      name
      sub_period_end
      role
    }
  }
`

export default getUsersByRoleName
