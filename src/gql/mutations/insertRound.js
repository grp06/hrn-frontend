import gql from 'graphql-tag'

const insertRound = gql`
  mutation insertRound($partner_x: Int!, $partner_y: Int!, $round_number: Int!) {
    insert_rounds(
      objects: { partner_x: $partner_x, partner_y: $partner_y, round_number: $round_number }
    ) {
      affected_rows
    }
  }
`
export default insertRound
