import gql from 'graphql-tag'

const updateUser = gql`
  mutation($id: Int!, $city: String!, $name: String!, $short_bio: String!, $linkedIn_url: String) {
    update_users(
      where: { id: { _eq: $id } }
      _set: { city: $city, name: $name, short_bio: $short_bio, linkedIn_url: $linkedIn_url }
    ) {
      returning {
        name
        city
        short_bio
        linkedIn_url
      }
    }
  }
`
export default updateUser
