import gql from 'graphql-tag'

const getUsersByRoleName = gql`
  query getUsersByRoleName($role: String!, $now: timestamptz) {
    users(where: { _and: [{ role: { _eq: $role } }, { sub_period_end: { _gt: $now } }] }) {
      id
      city
      email
      name
      sub_period_end
      role
      became_host_at
      linkedIn_url
    }
  }
`

export default getUsersByRoleName
