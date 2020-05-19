import gql from 'graphql-tag'

const setRoundToZero = gql`
  mutation setRoundToZero {
    update_events(where: { id: { _eq: 3 } }, _set: { current_round: 0 }) {
      affected_rows
    }
  }
`
export default setRoundToZero
