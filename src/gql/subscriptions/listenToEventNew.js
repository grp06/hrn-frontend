import gql from 'graphql-tag'

const listenToEventNew = gql`
  subscription listenToEventNew($event_id: Int!) {
    events_new(where: { id: { _eq: $event_id } }) {
      ended_at
      host_id
      host {
        cash_app
        email
        name
        profile_pic_url
      }
      id
      num_rounds
      round_length
      start_at
      status
    }
  }
`

export default listenToEventNew
