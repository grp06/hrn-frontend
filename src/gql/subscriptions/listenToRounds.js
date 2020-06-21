import gql from 'graphql-tag'

const listenToRounds = gql`
  subscription listenToRounds($event_id: Int!) {
    rounds(where: { event_id: { _eq: $event_id } }) {
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
