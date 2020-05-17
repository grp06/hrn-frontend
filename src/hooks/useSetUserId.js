import { useEffect } from 'react'

import { useGameContext } from '../context/useGameContext'

const useSetUserId = () => {
  const { setUserId } = useGameContext()

  useEffect(() => {
    const myUserId = localStorage.getItem('userId')
    setUserId(myUserId)
  }, [])

  return null
}

export default useSetUserId
