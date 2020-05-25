import { useEffect, useState } from 'react'
import { useGetRoomId, useSetToken } from '.'
import { useGameContext } from '../context/useGameContext'

const { createLocalVideoTrack, connect } = require('twilio-video')

const useRoom = () => {
  const { roomId, setRoom, token } = useGameContext()

  const setMyRoom = async () => {
    const localVideoTrack = await createLocalVideoTrack()
    const myRoom = await connect(token, {
      name: roomId,
      tracks: [localVideoTrack],
      video: { height: 720, frameRate: 24, width: 1280 },
    })
    setRoom(myRoom)
  }

  return { setMyRoom }
}

export default useRoom
