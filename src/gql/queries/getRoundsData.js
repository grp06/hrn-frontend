import gql from 'graphql-tag'

const getRoundsData = gql`
  query getRoundsData {
    rounds {
      id
      round_number
      partner_x
      partner_y
    }
  }
`

export default getRoundsData
