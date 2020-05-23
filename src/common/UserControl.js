import React, { useEffect, useState, useCallback } from 'react'

import { MainVideo } from '../components'
import { Room } from '.'
import { useGameContext } from '../context/useGameContext'
import endpointUrl from '../utils/endpointUrl'

const UserControl = () => {
  const { currentRound, userId, roundsData, setRoomId, roomId, setToken, token } = useGameContext()
  const [roomJoined, setRoomJoined] = useState(false)

  // This gets the current round that you're in and sets the roomId on the context
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

  // when the roomId changes, you fetch a token and then set the token
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
        .then(({ token: roomToken }) => {
          setToken(roomToken)
        })
    }
  }, [roomId])

  const handleLogout = useCallback((event) => {
    setToken(null)
  }, [])

  const joinRoom = () => {
    setRoomJoined(true)
  }

  let render
  if (token && currentRound !== 0) {
    render = !roomJoined ? (
      <button onClick={joinRoom}>Join room</button>
    ) : (
      <Room roomName={roomId} token={token} handleLogout={handleLogout} />
    )
  } else {
    render = <div>lobby</div>
  }
  console.log('roomJoined = ', roomJoined)
  return render
}

export default UserControl
