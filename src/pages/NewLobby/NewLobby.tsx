import React, { useEffect, useState } from 'react'
import { Loading } from '../../common'
import { useEventContext, useUserContext, useUserEventStatusContext } from '../../context'
import { getToken } from '../../helpers'
import { useGroupTwilio } from '../../hooks'

const { connect } = require('twilio-video')

declare global {
  interface Window {
    lobbyTwilioRoom: any
  }
}

const NewLobby: React.FC<{}> = () => {
  const { event, eventContextLoading } = useEventContext()
  const { user, userContextLoading } = useUserContext()
  const { userHasEnabledCameraAndMic } = useUserEventStatusContext()
  const { startGroupVideoChatTwilio } = useGroupTwilio()
  const { id: event_id } = event
  const { id: user_id } = user
  const [newLobbyToken, setNewLobbyToken] = useState<string>('')

  useEffect(() => {
    const uniqueRoomName = `${event_id}-lobby`
    const localStoragePreferredVideoId = localStorage.getItem('preferredVideoId')
    const localStoragePreferredAudioId = localStorage.getItem('preferredAudioId')
    const audioDevice =
      process.env.NODE_ENV === 'production' ? { deviceId: localStoragePreferredAudioId } : false

    const getTwilioToken = async () => {
      const res = await getToken(uniqueRoomName, user_id).then((response) => response.json())
      console.log('res ->', res)
      return res.token
    }

    const getLobbyTwilioRoom = async (token: string) => {
      console.log('CALLING CONNECT')
      const room = await connect(token, {
        maxAudioBitrate: 16000,
        video: { deviceId: localStoragePreferredVideoId },
        audio: audioDevice,
      })
      console.log('setting room ')
      window.lobbyTwilioRoom = room
      return room
    }

    if (event_id && user_id && userHasEnabledCameraAndMic && !newLobbyToken) {
      getTwilioToken()
        .then((token) => {
          setNewLobbyToken(token)
          return getLobbyTwilioRoom(token)
        })
        .then((room) => {
          startGroupVideoChatTwilio(room)
        })
    }
  }, [event_id, newLobbyToken, user_id, userHasEnabledCameraAndMic])

  if (eventContextLoading || userContextLoading) {
    return <Loading />
  }

  return <div>Hello</div>
}

export default NewLobby
