import gql from 'graphql-tag'

const incrementRound = gql`
  mutation incrementRound {
    update_gameState(where: {}, _inc: { currentRound: 1 }) {
      returning {
        currentRound
        gameOver
      }
    }
  }
`
export default incrementRound
