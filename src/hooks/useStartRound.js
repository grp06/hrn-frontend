import { useEffect } from 'react'
import { useMutation } from 'react-apollo'
import { useGameContext } from '../context/useGameContext'
import { incrementRound } from '../gql/mutations'
import { useCreateRooms } from '.'
// call API which will disconnect all users from their rooms
// it should also complete the rooms afterwards
// then we want to create new rooms
// then increment
export default function useStartRounds() {
  const { currentRound } = useGameContext()
  const [incrementRoundMutation] = useMutation(incrementRound)
  const { createRooms } = useCreateRooms()
  useEffect(() => {}, [])

  const startRound = async (rounds) => {
    const currentRoundObj = rounds.filter((round) => round.round_number === currentRound + 1)
    console.log('rounds = ', rounds)
    const allRoomIds = currentRoundObj.reduce((all, item) => {
      all.push(item.id)
      return all
    }, [])

    console.log('allRoomIds = ', allRoomIds)

    await createRooms(allRoomIds)
    incrementRoundMutation()
  }

  return { startRound }
}
