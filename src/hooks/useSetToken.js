import { useEffect, useState } from 'react'
import { useGetRoomId } from '.'
import { useGameContext } from '../context/useGameContext'
import { getToken } from '../helpers'

const useSetToken = () => {
  const { userId } = useGameContext()
  const [token, setToken] = useState(null)
  const { roomId } = useGetRoomId()

  useEffect(() => {
    const grabToken = async () => {
      const res = await getToken(roomId, userId).then((response) => response.json())
      setToken(res.token)
    }
    grabToken()
  }, [roomId])

  return { token }
}

export default useSetToken
