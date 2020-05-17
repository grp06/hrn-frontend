import gql from 'graphql-tag'

const getCurrentRound = gql`
  subscription getCurrentRound {
    gameState {
      currentRound
    }
  }
`

export default getCurrentRound
