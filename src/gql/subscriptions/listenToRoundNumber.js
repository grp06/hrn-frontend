import gql from 'graphql-tag'

const listenToRoundNumber = gql`
  subscription listenToRoundNumber($eventId: Int!) {
    events(where: { id: { _eq: $eventId } }) {
      current_round
    }
  }
`

export default listenToRoundNumber
