import gql from 'graphql-tag'

const updateUser = gql`
  mutation(
    $id: Int!
    $city: String!
    $first_name: String!
    $last_name: String!
    $short_bio: String
    $linkedIn_url: String
  ) {
    update_users(
      where: { id: { _eq: $id } }
      _set: {
        city: $city
        first_name: $first_name
        last_name: $last_name
        short_bio: $short_bio
        linkedIn_url: $linkedIn_url
      }
    ) {
      returning {
        first_name
        last_name
        city
        short_bio
        linkedIn_url
      }
    }
  }
`
export default updateUser
