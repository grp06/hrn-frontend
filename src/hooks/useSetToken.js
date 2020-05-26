import { useEffect, useState, useCallback } from 'react'
import { useRoom } from '.'
import { getToken } from '../helpers'
import { useGameContext } from '../context/useGameContext'

const useSetToken = () => {
  const { userId, roomId, setToken, token, room } = useGameContext()
  const { setMyRoom } = useRoom()

  useEffect(() => {
    if (token && roomId && !room) {
      setMyRoom()
    }
  }, [token, roomId, room])

  const setMyToken = async () => {
    const res = await getToken(roomId, userId).then((response) => response.json())
    setToken(res.token)
  }

  return { setMyToken }
}

export default useSetToken
