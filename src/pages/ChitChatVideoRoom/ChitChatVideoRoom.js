import React, { useEffect, useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import Button from '@material-ui/core/Button'
import { useAppContext, useChitChatContext, useUserContext } from '../../context'
import { getToken, useChitChatHelpers } from '../../helpers'
import { useChitChatTwilio } from '../../hooks'
import { RoundProgressBar } from '../VideoRoom'
import { makeStyles } from '@material-ui/styles'
const { connect } = require('twilio-video')

const useStyles = makeStyles((theme) => ({
  localVideo: {
    width: '100vw',
    height: '50vw',
    position: 'fixed',
    top: 'auto',
    bottom: '0',
    backgroundColor: 'red',
  },
  pageContainer: {
    position: 'relative',
  },
  remoteVideo: {
    width: '100vw',
    height: '50vw',
    position: 'fixed',
    top: '0',
    bottom: 'auto',
    backgroundColor: 'blue',
  },
}))

const ChitChatVideoRoom = () => {
  const classes = useStyles()
  const { id } = useParams()
  const chitChatId = parseInt(id, 10)
  const { startChitChatTwilio } = useChitChatTwilio()

  const { appLoading } = useAppContext()
  const { onlineChitChatUsersArray } = useChitChatContext()
  const { resetChitChat } = useChitChatHelpers()
  const {
    user: { id: userId },
  } = useUserContext()

  const { chitChat, setEventNewId } = useChitChatContext()
  const [chitChatToken, setChitChatToken] = useState(null)
  const [chitChatRoom, setChitChatRoom] = useState(null)
  const { host, host_id, start_at, status: event_status } = chitChat
  const { name: hostName, profile_pic_url: hostProfilePicUrl } = host || {}
  const history = useHistory()

  // const { firstUpdate } = location.state
  const currentFan = onlineChitChatUsersArray.find((fan) => fan.status === 'in-chat')

  useEffect(() => {
    const uniqueRoomName = `chitChat-${chitChatId}`
    const localStoragePreferredVideoId = localStorage.getItem('preferredVideoId')
    const localStoragePreferredAudioId = localStorage.getItem('preferredAudioId')
    const audioDevice =
      process.env.NODE_ENV === 'production' ? { deviceId: localStoragePreferredAudioId } : false

    const getTwilioToken = async () => {
      const res = await getToken(uniqueRoomName, userId).then((response) => response.json())
      return res.token
    }

    const getChitChatRoom = async (token) => {
      const room = await connect(token, {
        maxAudioBitrate: 16000,
        video: { deviceId: localStoragePreferredVideoId },
        audio: audioDevice,
      })
      return room
    }

    if (chitChatId && userId) {
      console.log('getting twilio token')
      getTwilioToken()
        .then((token) => {
          console.log('👅 token ->', token)
          return getChitChatRoom(token)
        })
        .then((room) => {
          startChitChatTwilio(room)
        })
    }
  }, [chitChatId, userId])

  useEffect(() => {
    if (chitChatToken) {
    }
  }, [chitChatToken])

  useEffect(() => {
    if (!Object.keys(chitChat).length && chitChatId) {
      setEventNewId(chitChatId)
    }
  }, [chitChatId, chitChat, setEventNewId])

  useEffect(() => {
    if (event_status === 'not-started') {
      history.push(`/chit-chat/${chitChatId}`)
    }
  }, [event_status])

  return (
    <div className={classes.pageContainer}>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => resetChitChat({ onlineChitChatUsersArray, chitChatId, userId })}
      >
        reset
      </Button>
      <div id="local-video" className={classes.localVideo} />
      <div id="remote-video" className={classes.remoteVideo} />
      {currentFan && <RoundProgressBar userUpdatedAt={currentFan.updated_at} event={chitChat} />}
    </div>
  )
}

export default ChitChatVideoRoom
