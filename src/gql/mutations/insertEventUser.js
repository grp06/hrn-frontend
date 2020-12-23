import gql from 'graphql-tag'

const insertEventUser = gql`
  mutation insertEventUser($event_id: Int!, $user_id: Int!) {
    insert_event_users(objects: { event_id: $event_id, user_id: $user_id }) {
      returning {
        id
        event_id
        user_id
      }
    }
  }
`
export default insertEventUser
