import React, { useEffect, useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import { useAppContext, useChitChatContext, useUserContext } from '../../context'
import { getToken, useChitChatHelpers } from '../../helpers'
import { useChitChatTwilio } from '../../hooks'
import { RoundProgressBar } from '../VideoRoom'
import { makeStyles } from '@material-ui/styles'
import endCall from '../../assets/end-call.png'
import meetNextFan from '../../assets/meet-next-fan.png'

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
  meetNextFan: {
    width: '300px',
    height: '50px',
    backgroundImage: `url(${meetNextFan})`,
    backgroundPosition: '50% 50%',
    backgroundSize: 'cover',
    position: 'fixed',
    bottom: '10px',
    margin: '0 auto',
    left: 'calc(50% - 150px)',
  },
  breather: {
    height: '50vh',
    position: 'fixed',
    top: '0',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    padding: theme.spacing(0, 2),
  },
}))

const ChitChatVideoRoom = () => {
  const classes = useStyles()
  const { id } = useParams()
  const chitChatId = parseInt(id, 10)
  const { startChitChatTwilio } = useChitChatTwilio()

  const { appLoading } = useAppContext()
  const { onlineChitChatUsersArray } = useChitChatContext()
  const { resetChitChat, endCall, startNextChitChat } = useChitChatHelpers()
  const {
    user: { id: userId },
  } = useUserContext()

  const { chitChat, setEventNewId, chitChatRSVPs } = useChitChatContext()
  const [chitChatToken, setChitChatToken] = useState(null)
  const [chitChatRoom, setChitChatRoom] = useState(null)
  const { host, host_id, start_at, status: eventStatus } = chitChat
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

    if (chitChatId && userId && !chitChatToken) {
      getTwilioToken()
        .then((token) => {
          console.log('👅 token ->', token)
          // doing this because sometimes we already have a token then we call get token again
          // this is the only way I can think of getting into this IF at the moment
          setChitChatToken(token)
          return getChitChatRoom(token)
        })
        .then((room) => {
          startChitChatTwilio(room)
        })
    }
  }, [chitChatId, userId])

  // useEffect(() => {
  //   if (chitChatToken) {
  //   }
  // }, [chitChatToken])

  useEffect(() => {
    if (userId && !userIsHost && onlineChitChatUsersArray.length) {
      const currentFan = onlineChitChatUsersArray.find((eventUser) => eventUser.user_id === userId)
      if (currentFan && currentFan.status === 'completed') {
        chitChatRoom.disconnect()
        history.push(`/chit-chat/${chitChatId}/call-complete`)
      }
    }
  }, [onlineChitChatUsersArray, userId])

  useEffect(() => {
    if (eventStatus === 'completed') {
      if (chitChatRoom) {
        chitChatRoom.disconnect()
      }
      history.push(`/chit-chat/${chitChatId}/call-complete`)
    }
  }, [eventStatus, chitChatRoom])

  useEffect(() => {
    if (!Object.keys(chitChat).length && chitChatId) {
      setEventNewId(chitChatId)
    }
  }, [chitChatId, chitChat, setEventNewId])

  useEffect(() => {
    if (eventStatus === 'not-started') {
      history.push(`/chit-chat/${chitChatId}`)
    }
  }, [eventStatus])

  return (
    <div className={classes.pageContainer}>
      <Button
        variant="contained"
        color="secondary"
        style={{ zIndex: 9999 }}
        onClick={() => resetChitChat({ onlineChitChatUsersArray, chitChatId })}
      >
        reset
      </Button>
      {eventStatus === 'paused' && (
        <Typography className={classes.breather}>
          We hope you enjoyed the call. Take a breather and get ready to meet your next fan!
        </Typography>
      )}
      <div id="remote-video" className={classes.remoteVideo}></div>
      <div id="local-video" className={classes.localVideo} />
      {currentFan && <RoundProgressBar userUpdatedAt={currentFan.updated_at} event={chitChat} />}
      {eventStatus === 'call-in-progress' && (
        <div
          className={classes.endCall}
          onClick={() => endCall({ onlineChitChatUsersArray, chitChatId, chitChatRSVPs })}
        />
      )}
      {eventStatus === 'paused' && (
        <div
          className={classes.meetNextFan}
          onClick={() => startNextChitChat({ onlineChitChatUsersArray, chitChatId })}
        />
      )}
    </div>
  )
}

export default ChitChatVideoRoom
