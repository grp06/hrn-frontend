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
          video: { height: 720, frameRate: 24, width: 1280 },
        })
        setRoom(myRoom)
      }
      getRoom()
    }
  }, [localVideoTrack, roomId])

  useEffect(() => {
    if (roomId && token) {
      console.log('roomId - ', roomId)
      const createVideoTrack = async () => {
        const track = await createLocalVideoTrack()

        setLocalVideoTrack(track)
      }
      createVideoTrack()
    }
  }, [roomId, token])

  return { room }
}

export default useRoom
