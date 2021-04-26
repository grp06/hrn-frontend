import gql from 'graphql-tag'

const findUserById = gql`
  query findUserById($id: Int) {
    users(where: { id: { _eq: $id } }) {
      id
      name
      first_name
      last_name
      role
      email
      city
      short_bio
      linkedIn_url
      profile_pic_url
      stripe_customer_id
      sub_period_end
      became_host_at
      tags_users {
        tag {
          name
          tag_id
          category
        }
      }
    }
  }
`

export default findUserById
