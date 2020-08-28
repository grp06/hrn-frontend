import gql from 'graphql-tag'

const getAllRounds = gql`
  query getAllRounds {
    rounds {
      partnerX {
        name
      }
      partnerY {
        name
      }
      event {
        start_at
      }
    }
  }
`

export default getAllRounds
