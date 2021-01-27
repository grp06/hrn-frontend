import React, { useEffect, useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import Button from '@material-ui/core/Button'
import { useAppContext, useChitChatContext, useUserContext } from '../../context'
import { getToken, useChitChatHelpers } from '../../helpers'
import { useChitChatTwilio } from '../../hooks'
import { RoundProgressBar } from '../VideoRoom'
import { makeStyles } from '@material-ui/styles'
import endCall from '../../assets/end-call.png'

const { connect } = require('twilio-video')

const useStyles = makeStyles((theme) => ({
  pageContainer: {
    position: 'relative',
    height: '100vh',
    width: '100%',
  },
  remoteVideo: {
    width: '100%',
    height: '50vh',
    position: 'fixed',
    top: '0',
    '& video': {
      height: '100%',
      width: '100%',
      objectFit: 'cover',
    },
  },
  localVideo: {
    width: '100%',
    height: '50vh',
    position: 'fixed',
    bottom: '0',
    '& video': {
      height: '100%',
      width: '100%',
      objectFit: 'cover',
    },
  },
  endCall: {
    width: '50px',
    height: '50px',
    backgroundImage: `url(${endCall})`,
    backgroundPosition: '50% 50%',
    backgroundSize: 'cover',
    position: 'fixed',
    bottom: '10px',
    margin: '0 auto',
    left: 'calc(50% - 25px)',
  },
}))

const ChitChatVideoRoom = () => {
  const classes = useStyles()
  const { id } = useParams()
  const chitChatId = parseInt(id, 10)
  const { startChitChatTwilio } = useChitChatTwilio()

  const { appLoading } = useAppContext()
  const { onlineChitChatUsersArray } = useChitChatContext()
  const { resetChitChat, endCall } = useChitChatHelpers()
  const {
    user: { id: userId },
  } = useUserContext()

  const { chitChat, setEventNewId } = useChitChatContext()
  const [chitChatToken, setChitChatToken] = useState(null)
  const [chitChatRoom, setChitChatRoom] = useState(null)
  const { host, host_id, start_at, status: event_status } = chitChat
  const { name: hostName, profile_pic_url: hostProfilePicUrl } = host || {}
  const history = useHistory()
  const userIsHost = parseInt(host_id, 10) === parseInt(userId, 10)

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
      setChitChatRoom(room)
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
    if (userId && !userIsHost && onlineChitChatUsersArray.length) {
      const currentFan = onlineChitChatUsersArray.find((eventUser) => eventUser.user_id === userId)
      if (currentFan && currentFan.status === 'completed') {
        console.log('🚀 ~ useEffect ~ chitChatRoom', chitChatRoom)
        chitChatRoom.disconnect()
        history.push(`/chit-chat/${chitChatId}/call-complete`)
      }
    }
  }, [onlineChitChatUsersArray, userId])

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
        style={{ zIndex: 9999 }}
        onClick={() => resetChitChat({ onlineChitChatUsersArray, chitChatId, userId })}
      >
        reset
      </Button>
      <div id="remote-video" className={classes.remoteVideo} />
      <div id="local-video" className={classes.localVideo} />
      {currentFan && <RoundProgressBar userUpdatedAt={currentFan.updated_at} event={chitChat} />}
      <div
        className={classes.endCall}
        onClick={() => endCall({ onlineChitChatUsersArray, chitChatId, userId })}
      />
    </div>
  )
}

export default ChitChatVideoRoom
