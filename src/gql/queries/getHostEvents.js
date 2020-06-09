import gql from 'graphql-tag'

const getHostEvents = gql`
  query getHostsEvents($userId: Int!) {
    events(where: { host_id: { _eq: $userId } }) {
      id
      ended_at
      description
      event_name
      host_id
      start_at
      current_round
    }
  }
`

export default getHostEvents
