import { useEffect, useState } from 'react'
import { useGetRoomId, useSetToken, useLocalVideoTrack } from '.'

const { connect } = require('twilio-video')

const useRoom = () => {
  const { roomId } = useGetRoomId()
  const { token } = useSetToken()
  const { videoTrack } = useLocalVideoTrack()
  const [room, setRoom] = useState(false)

  useEffect(() => {
    if (token && roomId && videoTrack) {
      const makeRoom = async () => {
        const roomResponse = await connect(token, {
          name: roomId,
          tracks: [videoTrack],
        })
        setRoom(roomResponse)
      }
      makeRoom()
    }
  }, [videoTrack, token, roomId])
  return { room }
}

export default useRoom
