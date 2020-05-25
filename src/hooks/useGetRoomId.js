import { useEffect } from 'react'
import { useGameContext } from '../context/useGameContext'
import { useSetToken } from '.'

const useGetRoomId = () => {
  const { currentRound, roundsData, userId, setRoomId, roomId, room, token } = useGameContext()
  const { setMyToken } = useSetToken()
  const canGetRoomId = !!roundsData && roundsData.rounds.length && currentRound !== null
  if (roomId && !room && !token) {
    setMyToken()
  }
  const getRoomId = () => {
    if (canGetRoomId) {
      const myRound = roundsData.rounds.find((round) => {
        const me =
          // dont know why I needed to add + 1 here?
          round.round_number === currentRound &&
          (round.partnerX_id === parseInt(userId, 10) || round.partnerY_id === parseInt(userId, 10))

        return me
      })

      // I think sometimes myRound is still undefined
      if (myRound) {
        setRoomId(myRound.id)
      }
    }
  }

  return { getRoomId }
}

export default useGetRoomId
