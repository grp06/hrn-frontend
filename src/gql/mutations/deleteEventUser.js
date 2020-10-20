import gql from 'graphql-tag'

const deletEventUser = gql`
  mutation deleteEventUser($event_id: Int!, $user_id: Int!) {
    delete_event_users(where: { event_id: { _eq: $event_id }, user_id: { _eq: $user_id } }) {
      affected_rows
      returning {
        event_id
        user_id
      }
    }
  }
`
export default deletEventUser
