import gql from 'graphql-tag'

const getEvent = gql`
  query getEvent($id: Int) {
    events(where: { id: { _eq: $id } }) {
      id
      host_id
      start_at
      description
      ended_at
      event_name
    }
  }
`

export default getEvent
