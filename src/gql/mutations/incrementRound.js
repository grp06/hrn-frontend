import gql from 'graphql-tag'

const incrementRound = gql`
  mutation incrementRound($id: Int) {
    update_events(_inc: { current_round: 1 }, where: { id: { _eq: $id } }) {
      returning {
        current_round
      }
    }
  }
`
export default incrementRound
