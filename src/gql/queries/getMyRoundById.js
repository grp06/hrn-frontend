import gql from 'graphql-tag'

const getMyRoundById = gql`
  query getMyRoundById($round_number: Int!, $id: Int!) {
    rounds(
      where: {
        _or: [{ partnerY_id: { _eq: $id } }, { partnerX_id: { _eq: $id } }]
        _and: { round_number: { _eq: $round_number } }
      }
    ) {
      id
      partnerX_id
      partnerY_id
      round_number
    }
  }
`

export default getMyRoundById
