import { useEffect } from 'react'
import { useMutation } from 'react-apollo'
import { useGameContext } from '../context/useGameContext'
import { incrementRound } from '../gql/mutations'
import { useCreateRooms } from '.'

export default function useStartRounds() {
  const { currentRound } = useGameContext()
  const [incrementRoundMutation] = useMutation(incrementRound)
  const { createRooms } = useCreateRooms()

  const startRound = async (rounds) => {
    const currentRoundObj = rounds.filter((round) => round.round_number === currentRound + 1)
    const allRoomIds = currentRoundObj.reduce((all, item) => {
      all.push(item.id)
      return all
    }, [])

    await createRooms(allRoomIds)

    incrementRoundMutation()
  }

  return { startRound }
}
