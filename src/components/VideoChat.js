import React, { useState, useCallback } from 'react'

import { useGameContext } from '../context/useGameContext'

const VideoChat = () => {
  const { token, partnerX, roundsData } = useGameContext()
  const [roomName, setRoomName] = useState('')
  const handleRoomNameChange = useCallback((event) => {
    setRoomName(event.target.value)
  }, [])

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault()
      const data = await fetch('/video/token', {
        method: 'POST',
        body: JSON.stringify({
          identity: username,
          room: roomName,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((res) => res.json())
      setToken(data.token)
    },
    [username, roomName]
  )
  return <div>HEY</div> // we'll build up our response later
}

export default VideoChat
