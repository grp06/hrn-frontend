import gql from 'graphql-tag'

const getEventById = gql`
  query getEventById($event_id: Int) {
    events(where: { id: { _eq: $event_id } }) {
      id
      host_id
      start_at
      description
      ended_at
      event_name
      current_round
      event_users {
        user {
          id
          name
          last_seen
        }
      }
    }
  }
`

export default getEventById
