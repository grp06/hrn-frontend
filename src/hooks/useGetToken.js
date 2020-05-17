import { useEffect } from 'react'

import { useGameContext } from '../context/useGameContext'
import endpointUrl from '../utils/endpointUrl'

const useGameState = () => {
  const userId = localStorage.getItem('userId')
  const { setToken, partnerX } = useGameContext()

  useEffect(() => {
    if (partnerX) {
      console.log('give me a token')
      fetch(`${endpointUrl}/give-me-a-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ partnerX, myUserId: userId }),
      })
        .then((res) => res.json())
        .then(({ token }) => {
          setToken(token)
          fetch(`${endpointUrl}/get-my-room/${partnerX}`)
            .then((apiData) => {
              return apiData.json()
            })
            .then((myRoomInfo) => {
              console.log('myRoomInfo = ', myRoomInfo)
            })
            .catch((err) => console.log('err = ', err))
        })
    }
  }, [partnerX])
}

export default useGameState
