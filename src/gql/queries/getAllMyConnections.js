import gql from 'graphql-tag'

const getAllMyConnections = gql`
  query getAllMyConnections($user_id: Int!) {
    rounds(
      where: {
        _or: [{ partnerY_id: { _eq: $user_id } }, { partnerX_id: { _eq: $user_id } }]
        _and: [{ partnerY_thumb: { _eq: true } }, { partnerX_thumb: { _eq: true } }]
      }
      order_by: { round_number: asc }
    ) {
      partnerY {
        id
        name
        email
        city
        tags_users {
          tag {
            name
            tag_id
            category
          }
        }
      }
      partnerX {
        id
        name
        email
        city
        tags_users {
          tag {
            tag_id
            name
            category
          }
        }
      }
      event {
        event_name
      }
    }
  }
`

export default getAllMyConnections
