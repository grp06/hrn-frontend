import { useCreateRooms } from '.'
import { useGameContext } from '../context/useGameContext'

export default function useStartRounds() {
  const { currentRound } = useGameContext()
  const { createRooms } = useCreateRooms()

  const startRound = async (rounds) => {
    const currentRoundObj = rounds.filter((round) => round.round_number === currentRound + 1)
    const allRoomIds = currentRoundObj.reduce((all, item) => {
      all.push(item.id)
      return all
    }, [])

    await createRooms(allRoomIds)
  }

  return { startRound }
}
