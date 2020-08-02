import gql from 'graphql-tag'

const getMyMutualThumbsData = gql`
  subscription getMyMutualThumbsData($event_id: Int!, $user_id: Int!) {
    rounds(
      where: {
        _or: [{ partnerY_id: { _eq: $user_id } }, { partnerX_id: { _eq: $user_id } }]
        _and: [
          { event_id: { _eq: $event_id } }
          { partnerY_thumb: { _eq: true } }
          { partnerX_thumb: { _eq: true } }
        ]
      }
      order_by: { round_number: asc }
    ) {
      partnerY {
        id
        name
        email
        city
        short_bio
        linkedIn_url
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
        short_bio
        linkedIn_url
        tags_users {
          tag {
            name
            tag_id
            category
          }
        }
      }
      round_number
    }
  }
`

export default getMyMutualThumbsData
