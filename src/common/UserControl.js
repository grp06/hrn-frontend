import React, { useEffect } from 'react'

import { MainVideo } from '../components'

import { useGameContext } from '../context/useGameContext'
import endpointUrl from '../utils/endpointUrl'

const UserControl = () => {
  const { currentRound, userId, roundsData, setRoomId, roomId, setToken } = useGameContext()
  useEffect(() => {
    if (roundsData && roundsData.rounds && roundsData.rounds.length && currentRound) {
      const myRound = roundsData.rounds.find((round) => {
        const me =
          round.round_number === currentRound &&
          (round.partnerX_id === parseInt(userId, 10) || round.partnerY_id === parseInt(userId, 10))

        return me
      })
      console.log('myRound.id = ', myRound.id)
      setRoomId(myRound.id)
    }
  }, [currentRound, roundsData])

  useEffect(() => {
    if (roomId) {
      console.log('roomId = ', roomId)
      fetch(`${endpointUrl}/api/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ roomId, myUserId: userId }),
      })
        .then((res) => res.json())
        .then(({ token }) => {
          setToken(token)
          fetch(`${endpointUrl}/api/rooms/${roomId}`)
            .then((apiData) => {
              return apiData.json()
            })
            .then((myRoomInfo) => {
              console.log('myRoomInfo = ', myRoomInfo)
            })
            .catch((err) => console.log('err = ', err))
        })
    }
  }, [roomId])

  if (currentRound === 0) {
    return <div>waiting for event to start</div>
  }

  return (
    <>
      <MainVideo />
    </>
  )
}

export default UserControl
