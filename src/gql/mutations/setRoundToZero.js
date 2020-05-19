import gql from 'graphql-tag'

const setRoundToZero = gql`
  mutation setRoundToZero($id: Int!) {
    update_events(where: { id: { _eq: $id } }, _set: { current_round: 0 }) {
      affected_rows
    }
  }
`
export default setRoundToZero
