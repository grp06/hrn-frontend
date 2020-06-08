import gql from 'graphql-tag'

const insertRound = gql`
  mutation resetEvent($id: Int!) {
    update_events(where: { id: { _eq: $id } }, _set: { ended_at: null }) {
      returning {
        description
        event_name
        host_id
        id
        start_at
        ended_at
      }
    }
  }
`
export default insertRound
