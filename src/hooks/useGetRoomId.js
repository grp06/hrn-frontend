import { useEffect } from 'react'
import { useGameContext } from '../context/useGameContext'
import { useSetToken } from '.'

const useGetRoomId = () => {
  const { myRound, setRoomId, roomId, room, token } = useGameContext()
  const { setMyToken } = useSetToken()

  useEffect(() => {
    if (roomId && !room && !token) {
      setMyToken()
    }
  }, [roomId, room, token])

  const getRoomId = () => {
    if (myRound) {
      setRoomId(myRound.id)
    }
  }

  return { getRoomId }
}

export default useGetRoomId
