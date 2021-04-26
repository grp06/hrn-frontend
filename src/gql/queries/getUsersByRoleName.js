import gql from 'graphql-tag'

const getUsersByRoleName = gql`
  query getUsersByRoleName($role: String!) {
    users(where: { role: { _eq: $role } }, order_by: { became_host_at: desc_nulls_last }) {
      id
      city
      email
      first_name
      last_name
      sub_period_end
      role
      became_host_at
      profile_pic_url
      linkedIn_url
    }
  }
`

export default getUsersByRoleName
