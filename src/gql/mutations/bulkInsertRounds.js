import gql from 'graphql-tag'

const bulkInsertRounds = gql`
  mutation bulkInsertRounds($objects: [rounds_insert_input!]!) {
    insert_rounds(objects: $objects) {
      returning {
        partner_x
        partner_y
        round_number
      }
    }
  }
`
export default bulkInsertRounds
