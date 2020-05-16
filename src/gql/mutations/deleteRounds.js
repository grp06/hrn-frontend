import gql from 'graphql-tag'

const insertRound = gql`
  mutation DeleteRounds($old: timestamptz) {
    delete_rounds(where: { started_at: { _lt: $old } }) {
      affected_rows
    }
  }
`
export default insertRound
