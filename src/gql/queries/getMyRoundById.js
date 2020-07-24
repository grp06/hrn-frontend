import gql from 'graphql-tag'

const getMyRoundById = gql`
  query getMyRoundById($round_number: Int!, $user_id: Int!, $event_id: Int!) {
    rounds(
      where: {
        _or: [{ partnerY_id: { _eq: $user_id } }, { partnerX_id: { _eq: $user_id } }]
        _and: { round_number: { _eq: $round_number } }
        event_id: { _eq: $event_id }
      }
    ) {
      id
      partnerX_id
      partnerY_id
      round_number
      started_at
      partnerX {
        name
        city
        tags_users {
          tag {
            name
          }
        }
      }
      partnerY {
        name
        city
        tags_users {
          tag {
            name
          }
        }
      }
    }
  }
`

export default getMyRoundById
