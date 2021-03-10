import gql from 'graphql-tag'

const updateEventAttendeesSide = gql`
  mutation updateEventAttendeesSide($event_id: Int!, $side: String!, $user_id: Int!) {
    update_event_users(
      where: { event_id: { _eq: $event_id }, user_id: { _eq: $user_id } }
      _set: { side: $side }
    ) {
      returning {
        side
        user_id
        event_id
      }
    }
  }
`
export default updateEventAttendeesSide
