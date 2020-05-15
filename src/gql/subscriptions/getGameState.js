import gql from 'graphql-tag'

const getGameState = gql`
  subscription getGameState {
    gameState {
      currentRound
      gameOver
    }
  }
`

export default getGameState
