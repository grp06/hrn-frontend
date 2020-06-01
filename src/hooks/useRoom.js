import { useEffect } from 'react'
import { useTwilio } from '.'
import { useGameContext } from '../context/useGameContext'

const useRoom = () => {
  const { room } = useGameContext()
  const { startTwilio } = useTwilio()
  useEffect(() => {
    if (room) {
      startTwilio()
    }
  }, [room])
}
export default useRoom
