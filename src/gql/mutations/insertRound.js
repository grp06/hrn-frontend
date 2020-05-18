import gql from 'graphql-tag'

const insertRound = gql`
  mutation insertRound($partnerX_id: Int!, $partnerY_id: Int!, $round_number: Int!) {
    insert_rounds(
      objects: { partnerX_id: $partnerX_id, partnerY_id: $partnerY_id, round_number: $round_number }
    ) {
      affected_rows
    }
  }
`
export default insertRound
