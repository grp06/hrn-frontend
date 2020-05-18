import gql from 'graphql-tag'

const deleteRounds = gql`
  mutation deleteAllRounds {
    delete_rounds(where: { started_at: { _lt: "2021-05-18T23:04:01.905+00:00" } }) {
      affected_rows
    }
  }
`
export default deleteRounds
