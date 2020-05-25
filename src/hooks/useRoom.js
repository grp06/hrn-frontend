import { useEffect } from 'react'
import { useTwilio } from '.'
import { useGameContext } from '../context/useGameContext'

const { createLocalVideoTrack, connect } = require('twilio-video')

const useRoom = () => {
  const { roomId, setRoom, token, room } = useGameContext()
  const { startTwilio } = useTwilio()

  useEffect(() => {
    if (room) {
      startTwilio()
    }
  }, [room])

  const setMyRoom = async () => {
    const localVideoTrack = await createLocalVideoTrack()
    console.log('connect')
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
