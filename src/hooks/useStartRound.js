import { useCreateRooms } from '.'
import { useEventContext } from '../context/useEventContext'

export default function useStartRounds() {
  const { current_round } = useEventContext()
  const { createRooms } = useCreateRooms()

  const startRound = async (rounds) => {
    const currentRoundObj = rounds.filter((round) => round.round_number === current_round + 1)
    const allRoomIds = currentRoundObj.reduce((all, item) => {
      all.push(item.id)
      return all
    }, [])

    await createRooms(allRoomIds)
  }

  return { startRound }
}
