import gql from 'graphql-tag'

const listenToRounds = gql`
  subscription listenToRounds($eventId: Int!) {
    rounds(where: { event_id: { _eq: $eventId } }) {
      id
      partnerX_id
      partnerX_thumb
      partnerY_id
      partnerY_thumb
      round_number
      started_at
    }
  }
`

export default listenToRounds
