import gql from 'graphql-tag'

const getAllRounds = gql`
  query getAllRounds {
    rounds {
      id
      round_number
      partner_x
      partner_y
    }
  }
`

export default getAllRounds
