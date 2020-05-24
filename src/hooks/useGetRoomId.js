import { useEffect, useState } from 'react'
import { useGameContext } from '../context/useGameContext'

const useGetRoomId = () => {
  const { currentRound, roundsData, userId } = useGameContext()
  const dataReady = roundsData && roundsData.rounds && roundsData.rounds.length && currentRound
  const [roomId, setRoomId] = useState(null)

  useEffect(() => {
    if (dataReady) {
      const myRound = roundsData.rounds.find((round) => {
        const me =
          round.round_number === currentRound &&
          (round.partnerX_id === parseInt(userId, 10) || round.partnerY_id === parseInt(userId, 10))
        return me
      })
      setRoomId(myRound.id)
    }
  }, [dataReady])
  return { roomId }
}

export default useGetRoomId