import gql from 'graphql-tag'

const deleteEvent = gql`
  mutation deleteEvent($event_id: Int!) {
    delete_events(where: { id: { _eq: $event_id } }) {
      returning {
        host_id
        id
        event_name
      }
    }
  }
`
export default deleteEvent
