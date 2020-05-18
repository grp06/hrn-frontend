import gql from 'graphql-tag'

const bulkInsertRounds = gql`
  mutation bulkInsertRounds($objects: [rounds_insert_input!]!) {
    insert_rounds(objects: $objects) {
      returning {
        partnerX_id
        partnerY_id
        round_number
      }
    }
  }
`
export default bulkInsertRounds
