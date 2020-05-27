import { useEffect } from 'react'
import { useTwilio } from '.'
import { useGameContext } from '../context/useGameContext'

const { createLocalVideoTrack, createLocalAudioTrack, connect } = require('twilio-video')

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
    const localAudioTrack = await createLocalAudioTrack()
    console.log('localVideoTrack = ', localVideoTrack)
    console.log('connect')
    const myRoom = await connect(token, {
      name: roomId,
      tracks: [localVideoTrack, localAudioTrack],
      video: { height: 720, frameRate: 24, width: 1280 },
      audio: true,
    })
    console.log('set room, twilioReady false')
    setRoom(myRoom, false)
  }

  return { setMyRoom }
}

export default useRoom
