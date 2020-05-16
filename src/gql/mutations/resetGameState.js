import gql from 'graphql-tag'

const insertRound = gql`
  mutation resetGameState {
    update_gameState(
      _set: { currentRound: 0, gameOver: false }
      where: { currentRound: { _gt: 0 } }
    ) {
      affected_rows
    }
  }
`
export default insertRound
