import gql from 'graphql-tag'

const listenToEvent = gql`
  subscription listenToEvent($id: Int!) {
    events(where: { id: { _eq: $id } }) {
      id
      current_round
      description
      ended_at
      event_name
      host_id
      start_at
    }
  }
`

export default listenToEvent
