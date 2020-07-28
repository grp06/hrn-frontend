import gql from 'graphql-tag'

const findUsers = gql`
  query getAllPublicEvents {
    events(where: { public_event: { _eq: true } }) {
      description
      current_round
      ended_at
      event_name
      host_id
      id
      public_event
      start_at
      status
      host {
        name
      }
    }
  }
`

export default findUsers
