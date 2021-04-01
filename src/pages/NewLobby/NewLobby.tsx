import React, { useEffect, useState } from 'react'
import { UserVideoCard } from '.'
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
  const { host_id, id: event_id } = event
  const { id: user_id } = user
  const [arrayOfParticipantsIdsWithVideoOn, setArrayOfParticipantsIdsWithVideoOn] = useState<
    string[]
  >([])
  const [newLobbyToken, setNewLobbyToken] = useState<string>('')
  const userIsHost = parseInt(host_id, 10) === parseInt(user_id, 10)
  const localStoragePreferredVideoId = localStorage.getItem('preferredVideoId')
  const localStoragePreferredAudioId = localStorage.getItem('preferredAudioId')
  const audioDevice =
    process.env.NODE_ENV === 'production' ? { deviceId: localStoragePreferredAudioId } : false

  const getTwilioToken = async () => {
    const res = await getToken(`${event_id}-lobby`, user_id).then((response) => response.json())
    console.log('res ->', res)
    return res.token
  }

  const getLobbyTwilioRoom = async (token: string) => {
    console.log('CALLING CONNECT')
    const room = await connect(token, {
      maxAudioBitrate: 16000,
      video: userIsHost ? { deviceId: localStoragePreferredVideoId } : false,
      audio: userIsHost ? audioDevice : false,
    })
    console.log('setting room ')
    window.lobbyTwilioRoom = room
    return room
  }

  const createAttendeeVideoCards = () => {
    console.log(
      '🌈 ~ arrayOfParticipantsIdsWithVideoOn.map ~ arrayOfParticipantsIdsWithVideoOn',
      arrayOfParticipantsIdsWithVideoOn
    )
    if (arrayOfParticipantsIdsWithVideoOn.length) {
      return arrayOfParticipantsIdsWithVideoOn.map((participantId) => {
        return <UserVideoCard height={200} userId={participantId} width={200} />
      })
    }
  }

  // get the twilio token and thens connect to the room
  // before starting twilio, make sure to loop through all the participants in the room
  // that have their video on and create a video card for them. This is important because
  // starting twilio will try to attach their video tracks to an existing div if the
  // remote participant has published their video track already.
  useEffect(() => {
    if (event_id && user_id && userHasEnabledCameraAndMic && !newLobbyToken) {
      getTwilioToken()
        .then((token) => {
          setNewLobbyToken(token)
          return getLobbyTwilioRoom(token)
        })
        .then((room) => {
          console.log('room.particpants ->', room.participants)
          const arrayOfParticipants = []
          room.participants.forEach((participant: any) =>
            arrayOfParticipants.push(participant.identity)
          )
          if (userIsHost) arrayOfParticipants.push(user_id.toString())
          setArrayOfParticipantsIdsWithVideoOn(arrayOfParticipants)
          return room
        })
        .then((room) => {
          startGroupVideoChatTwilio(room)
        })
    }
  }, [event_id, newLobbyToken, user_id, userHasEnabledCameraAndMic])

  if (eventContextLoading || userContextLoading) {
    return <Loading />
  }

  return <div id="videoBox">{createAttendeeVideoCards()}</div>
}

export default NewLobby
