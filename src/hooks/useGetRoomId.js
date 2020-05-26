import { useEffect } from 'react'
import { useGameContext } from '../context/useGameContext'
import { useSetToken } from '.'

const useGetRoomId = () => {
  const { roomId, room, token } = useGameContext()
  const { setMyToken } = useSetToken()

  useEffect(() => {
    if (roomId && !room && !token) {
      setMyToken()
    }
  }, [roomId, room, token])
}

export default useGetRoomId
