import gql from 'graphql-tag'

const listenToRoundsData = gql`
  subscription listenToRoundsData {
    rounds {
      id
      round_number
      partnerX_id
      partnerY_id
    }
  }
`

export default listenToRoundsData
