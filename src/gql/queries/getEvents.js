import gql from 'graphql-tag'

const getEvents = gql`
  query getEvents {
    events {
      id
      ended_at
      description
      event_name
      host_id
      start_at
    }
  }
`

export default getEvents
