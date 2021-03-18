import gql from 'graphql-tag'

const getUsersByRoleName = gql`
  query getUsersByRoleName($role: String!, $now: timestamptz) {
    users(
      where: { _and: [{ role: { _eq: $role } }, { sub_period_end: { _gt: $now } }] }
      order_by: { became_host_at: desc_nulls_last }
    ) {
      id
      city
      email
      name
      sub_period_end
      role
      became_host_at
      profile_pic_url
      linkedIn_url
    }
  }
`

export default getUsersByRoleName
