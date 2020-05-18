import gql from 'graphql-tag'

const getRoundsData = gql`
  query getRoundsData {
    rounds {
      id
      round_number
      partnerX_id
      partnerY_id
    }
  }
`

export default getRoundsData
