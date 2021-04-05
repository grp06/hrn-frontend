import React, { useEffect, useState } from 'react'
import { Button } from '@material-ui/core'
import { UserVideoCard } from '.'
import { Loading } from '../../common'
import { useEventContext, useUserContext, useUserEventStatusContext } from '../../context'
import { getToken } from '../../helpers'
import { useGroupTwilio } from '../../hooks'
import {
  publishParticipantsAudioAndVideo,
  unpublishParticipantsTracks,
} from '../../utils/lobbyStageFunctions'

const { connect, LocalDataTrack } = require('twilio-video')

declare global {
  interface Window {
    room: any
  }
}

const NewLobby: React.FC<{}> = () => {
  const { event, eventContextLoading } = useEventContext()
  const { user, userContextLoading } = useUserContext()
  const { onlineEventUsers, userHasEnabledCameraAndMic } = useUserEventStatusContext()
  const { startGroupVideoChatTwilio } = useGroupTwilio()
  const { host_id, id: event_id } = event
  const { id: user_id, name: users_name } = user

  const [arrayOfParticipantsWithVideoDivs, setArrayOfParticipantsWithVideoDivs] = useState<
    string[]
  >([])
  const [newLobbyToken, setNewLobbyToken] = useState<string>('')
  const [localDataTrack, setLocalDataTrack] = useState<any>(null)
  const userIsHost = parseInt(host_id, 10) === parseInt(user_id, 10)
  const localStoragePreferredVideoId = localStorage.getItem('preferredVideoId') || undefined
  const localStoragePreferredAudioId = localStorage.getItem('preferredAudioId') || undefined
  const audioDevice =
    process.env.NODE_ENV === 'production' ? { exact: localStoragePreferredAudioId } : undefined

  const getTwilioToken = async () => {
    const res = await getToken(`${event_id}-lobby`, user_id).then((response) => response.json())
    return res.token
  }

  const getLobbyTwilioRoom = async (token: string) => {
    console.log('CALLING CONNECT')
    const room = await connect(token, {
      maxAudioBitrate: 16000,
      video: userIsHost ? { deviceId: localStoragePreferredVideoId } : false,
      audio: audioDevice,
    })
    console.log('setting room ')
    window.room = room
    if (userIsHost) {
      const dataTrackPublication = await window.room.localParticipant.publishTrack(
        new LocalDataTrack()
      )
      setLocalDataTrack(dataTrackPublication.track)
    }
    return room
  }

  const createAttendeeVideoCards = () => {
    if (arrayOfParticipantsWithVideoDivs.length) {
      return arrayOfParticipantsWithVideoDivs.map((participantId) => {
        return (
          <div key={`${participantId}-video-card`}>
            <UserVideoCard height={200} userId={participantId} width={200} />
          </div>
        )
      })
    }
  }

  const joinStage = () => {
    if (window.room) {
      const { localParticipant } = window.room
      publishParticipantsAudioAndVideo(localParticipant)
    }
  }

  const leaveStage = () => {
    if (window.room) {
      const { localParticipant } = window.room
      unpublishParticipantsTracks(localParticipant)
    }
  }

  const sweepStage = () => {
    if (localDataTrack) {
      localDataTrack.send('sweep')
    }
  }

  // get the twilio token and thens connect to the room
  // before starting twilio, make sure to loop through all the participants in the room
  // that have their video on and create a video card for them. This is important because
  // starting twilio will try to attach their video tracks to an existing div if the
  // remote participant has published their video track already.
  useEffect(() => {
    if (
      event_id &&
      arrayOfParticipantsWithVideoDivs.length &&
      user_id &&
      userHasEnabledCameraAndMic &&
      !newLobbyToken
    ) {
      getTwilioToken()
        .then((token) => {
          setNewLobbyToken(token)
          return getLobbyTwilioRoom(token)
        })
        .then((room) => {
          startGroupVideoChatTwilio(room)
        })
    }
  }, [
    event_id,
    newLobbyToken,
    arrayOfParticipantsWithVideoDivs,
    user_id,
    userHasEnabledCameraAndMic,
  ])

  useEffect(() => {
    if (onlineEventUsers?.length && userHasEnabledCameraAndMic) {
      if (onlineEventUsers.length !== arrayOfParticipantsWithVideoDivs.length) {
        const userIds = onlineEventUsers.map((eventUser: any) => eventUser.user[0].id.toString())
        setArrayOfParticipantsWithVideoDivs(userIds)
      }
    }
  }, [onlineEventUsers, userHasEnabledCameraAndMic])

  if (eventContextLoading || userContextLoading || !arrayOfParticipantsWithVideoDivs.length) {
    return <Loading />
  }

  return (
    <div id="videoBox" style={{ display: 'flex' }}>
      {createAttendeeVideoCards()}
      <Button variant="contained" color="primary" onClick={() => joinStage()}>
        Join Stage
      </Button>
      <Button variant="contained" color="default" onClick={() => leaveStage()}>
        Leave Stage
      </Button>
      <Button variant="contained" color="secondary" onClick={() => sweepStage()}>
        Sweep
      </Button>
    </div>
  )
}

export default NewLobby
