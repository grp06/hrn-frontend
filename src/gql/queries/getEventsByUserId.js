import gql from 'graphql-tag'

const getEventsByUserId = gql`
  query getEventsByUserId($userId: Int!) {
    event_users(where: { user_id: { _eq: $userId } }) {
      event {
        description
        ended_at
        event_name
        host_id
        id
        start_at
      }
    }
  }
`

export default getEventsByUserId
