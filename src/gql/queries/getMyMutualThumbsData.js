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
    ) {
      partnerY {
        id
        name
        email
      }
      partnerX {
        id
        name
        email
      }
    }
  }
`

export default getMyMutualThumbsData
