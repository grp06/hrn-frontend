import { useEffect, useState } from 'react'
import { useGetRoomId, useSetToken } from '.'
import { useGameContext } from '../context/useGameContext'

const { createLocalVideoTrack, connect } = require('twilio-video')

const useRoom = () => {
  const { userId } = useGameContext()
  const [localVideoTrack, setLocalVideoTrack] = useState(null)
  const { roomId } = useGetRoomId()
  const { token } = useSetToken()
  const [room, setRoom] = useState(null)

  useEffect(() => {
    if (localVideoTrack) {
      const getRoom = async () => {
        const myRoom = await connect(token, {
          name: roomId,
          tracks: [localVideoTrack],
        })
        setRoom(myRoom)
      }
      getRoom()
    }
  }, [localVideoTrack])

  useEffect(() => {
    if ((roomId, token)) {
      const getLocalTracks = async () => {
        const track = await createLocalVideoTrack()
        setLocalVideoTrack(track)
      }
      getLocalTracks()
    }
  }, [roomId, token])

  return { room }
}

export default useRoom
