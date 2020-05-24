import { useEffect, useState } from 'react'
import { useGetRoomId } from '.'
import { getToken } from '../helpers'
import { useGameContext } from '../context/useGameContext'

const useSetToken = () => {
  const { userId } = useGameContext()
  const [token, setToken] = useState(null)
  const { roomId } = useGetRoomId()

  useEffect(() => {
    if (roomId) {
      const grabToken = async () => {
        const res = await getToken(roomId, userId).then((response) => response.json())
        setToken(res.token)
      }
      grabToken()
    }
  }, [roomId])

  return { token }
}

export default useSetToken
