import gql from 'graphql-tag'

const resetEvent = gql`
  mutation resetEvent($id: Int!) {
    update_events(
      where: { id: { _eq: $id } }
      _set: { ended_at: null, current_round: 0, status: "not-started" }
    ) {
      returning {
        description
        event_name
        host_id
        id
        start_at
        ended_at
        current_round
        status
      }
    }
  }
`
export default resetEvent
