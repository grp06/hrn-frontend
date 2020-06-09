import gql from 'graphql-tag'

const insertRound = gql`
  mutation resetEvent($id: Int!) {
    update_events(where: { id: { _eq: $id } }, _set: { ended_at: null, current_round: 0 }) {
      returning {
        description
        event_name
        host_id
        id
        start_at
        ended_at
        current_round
      }
    }
  }
`
export default insertRound
