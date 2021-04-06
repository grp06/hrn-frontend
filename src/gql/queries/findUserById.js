import gql from 'graphql-tag'

const findUserById = gql`
  query findUserById($id: Int) {
    users(where: { id: { _eq: $id } }) {
      id
      name
      role
      email
      city
      short_bio
      created_at
      linkedIn_url
      profile_pic_url
      stripe_customer_id
      sub_period_end
      became_host_at
      event_users {
        user_id
        event {
          host_id
        }
      }
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
