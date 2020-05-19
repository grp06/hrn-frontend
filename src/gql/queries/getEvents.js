import gql from 'graphql-tag'

const getEvents = gql`
  query getEvents {
    events {
      id
      event_name
      description
      host_id
    }
  }
`

export default getEvents
