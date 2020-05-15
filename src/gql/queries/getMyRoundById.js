import gql from 'graphql-tag'

const getMyRoundById = gql`
  query getMyRoundById($round_number: Int!, $id: Int!) {
    rounds(
      where: {
        _or: [{ partner_y: { _eq: $id } }, { partner_x: { _eq: $id } }]
        _and: { round_number: { _eq: $round_number } }
      }
    ) {
      id
      partner_x
      partner_y
      round_number
    }
  }
`

export default getMyRoundById
