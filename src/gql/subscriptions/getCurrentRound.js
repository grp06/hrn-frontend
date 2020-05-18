import gql from 'graphql-tag'

const getCurrentRound = gql`
  subscription getCurrentRound($eventId: Int!) {
    events(where: { id: { _eq: $eventId } }) {
      current_round
    }
  }
`

export default getCurrentRound
