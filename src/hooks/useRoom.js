import { useEffect } from 'react'
import { useTwilio } from '.'
import { useGameContext } from '../context/useGameContext'
const { createLocalTracks, connect } = require('twilio-video')
const useRoom = () => {
  const { roomId, setRoom, token, room } = useGameContext()
  const { startTwilio } = useTwilio()
  useEffect(() => {
    if (room) {
      startTwilio()
    }
  }, [room])
  const setMyRoom = async () => {
    const localTracks = await createLocalTracks({ video: true, audio: true })
    console.log('localVideoTrack = ', localTracks)
    console.log('connect')
    const myRoom = await connect(token, {
      name: roomId,
      tracks: localTracks,
    })
    console.log('set room, twilioReady false')
    setRoom(myRoom, false)
  }
  return { setMyRoom }
}
export default useRoom
