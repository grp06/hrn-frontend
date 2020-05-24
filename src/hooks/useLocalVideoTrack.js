import { useEffect, useState } from 'react'
import { useGetRoomId } from '.'
import { getToken } from '../helpers'
import { useGameContext } from '../context/useGameContext'

const { createLocalVideoTrack } = require('twilio-video')

const useSetVideoTrack = () => {
  const { roomId } = useGetRoomId()
  const [videoTrack, setVideoTrack] = useState()

  useEffect(() => {
    const createVideoTrack = async () => {
      const res = await createLocalVideoTrack()
      setVideoTrack(res)
    }
    createVideoTrack()
  }, [roomId])

  return { videoTrack }
}

export default useSetVideoTrack
