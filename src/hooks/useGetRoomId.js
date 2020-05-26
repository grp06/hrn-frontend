import { useEffect } from 'react'
import { useGameContext } from '../context/useGameContext'
import { useSetToken } from '.'

const useGetRoomId = () => {
  const { roomId, room, token } = useGameContext()
  const { setMyToken } = useSetToken()

  const setToken = () => {
    if (roomId && !room && !token) {
      setMyToken()
    }
  }

  return { setToken }
}

export default useGetRoomId
