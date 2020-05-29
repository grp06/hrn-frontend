import { useHistory } from 'react-router-dom'
import { useGameContext } from '../context/useGameContext'
import { useCreateRooms } from '.'

export default function useStartRounds() {
  const { currentRound } = useGameContext()
  const { createRooms } = useCreateRooms()
  const history = useHistory()

  const startRound = async (rounds) => {
    const currentRoundObj = rounds.filter((round) => round.round_number === currentRound + 1)
    const allRoomIds = currentRoundObj.reduce((all, item) => {
      all.push(item.id)
      return all
    }, [])

    await createRooms(allRoomIds)
    history.push('/video-room')
  }

  return { startRound }
}
