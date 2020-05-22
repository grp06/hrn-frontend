import React, { useEffect, useState } from 'react'

import { MainVideo } from '../components'

import { useGameContext } from '../context/useGameContext'
import endpointUrl from '../utils/endpointUrl'

const UserControl = () => {
  const { currentRound, userId, roundsData, setRoomId, roomId, setToken, token } = useGameContext()
  const [roomJoined, setRoomJoined] = useState(false)
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
        })
    }
  }, [roomId])

  const joinRoom = () => {
    setRoomJoined(true)
  }

  let render
  if (token && currentRound !== 0) {
    render = !roomJoined ? <button onClick={joinRoom}>Join room</button> : <MainVideo />
  } else {
    render = <div>lobby</div>
  }
  console.log('roomJoined = ', roomJoined)
  return render
}

export default UserControl
