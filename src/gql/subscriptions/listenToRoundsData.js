import gql from 'graphql-tag'

const onUserUpdated = gql`
  subscription listenToRoundsData {
    rounds {
      id
      round_number
      partner_x
      partner_y
    }
  }
`

export default onUserUpdated
