import React, { useEffect, useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import { CelebStatusMessageScreen, FanStatusMessageScreen } from '.'
import { useAppContext, useChitChatContext, useUserContext } from '../../context'
import { getToken, useChitChatHelpers } from '../../helpers'
import { useChitChatTwilio } from '../../hooks'
import { RoundProgressBar } from '../VideoRoom'
import { makeStyles } from '@material-ui/styles'
import endCallIcon from '../../assets/end-call.png'
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
    [theme.breakpoints.up('sm')]: {
      height: '100vh',
      display: 'flex',
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
    [theme.breakpoints.up('sm')]: {
      width: '200px',
      height: '200px',
      position: 'absolute',
      top: '3%',
      right: '1%',
      left: 'auto',
      bottom: 'auto',
      zIndex: 99,
      '& video': {
        borderRadius: 4,
        width: '200px',
      },
    },
  },
  endCall: {
    width: '50px',
    height: '50px',
    backgroundImage: `url(${endCallIcon})`,
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
}))

const ChitChatVideoRoom = () => {
  const classes = useStyles()
  const { id } = useParams()
  const chitChatId = parseInt(id, 10)

  const { startChitChatTwilio } = useChitChatTwilio()
  const { resetChitChat, endCall, startNextChitChat } = useChitChatHelpers()
  const {
    user: { id: userId },
  } = useUserContext()

  const {
    chitChat,
    chitChatRSVPs,
    fanNeverConnected,
    fanDisconnectedFromChat,
    onlineChitChatUsersArray,
    setChitChatId,
  } = useChitChatContext()
  const [chitChatToken, setChitChatToken] = useState(null)
  const [chitChatRoom, setChitChatRoom] = useState(null)
  const { host, host_id, start_at, status: chitChatStatus } = chitChat
  const { name: hostName, profile_pic_url: hostProfilePicUrl } = host || {}
  const history = useHistory()
  const userIsHost = parseInt(host_id, 10) === parseInt(userId, 10)
  const hostFirstName = hostName && hostName.split(' ')[0]

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

  useEffect(() => {
    if (userId && !userIsHost && chitChatRSVPs) {
      const currentFanRsvpObj = chitChatRSVPs.find((eventUser) => eventUser.user_id === userId)
      if (currentFanRsvpObj && currentFanRsvpObj.status === 'completed') {
        chitChatRoom.disconnect()
        history.push(`/chit-chat/${chitChatId}/call-completed`)
      }
    }
  }, [chitChatRSVPs, userId, userIsHost])

  useEffect(() => {
    if (chitChatStatus === 'completed') {
      if (chitChatRoom) {
        chitChatRoom.disconnect()
      }
      history.push(`/chit-chat/${chitChatId}/call-completed`)
    }
  }, [chitChatStatus, chitChatRoom])

  useEffect(() => {
    if (!Object.keys(chitChat).length && chitChatId) {
      setChitChatId(chitChatId)
    }
  }, [chitChatId, chitChat, setChitChatId])

  useEffect(() => {
    if (chitChatStatus === 'not-started') {
      history.push(`/chit-chat/${chitChatId}`)
    }
  }, [chitChatStatus])

  return (
    <div className={classes.pageContainer}>
      <Button
        variant="contained"
        color="secondary"
        style={{ zIndex: 9999 }}
        onClick={() =>
          resetChitChat({ onlineChitChatUsersArray, chitChatId, chitChatRoom, chitChatRSVPs })
        }
      >
        reset
      </Button>
      {userIsHost ? (
        <CelebStatusMessageScreen
          chitChatStatus={chitChatStatus}
          fanNeverConnected={fanNeverConnected}
          fanDisconnectedFromChat={fanDisconnectedFromChat}
        />
      ) : (
        <FanStatusMessageScreen
          chitChatStatus={chitChatStatus}
          fanNeverConnected={fanNeverConnected}
          fanDisconnectedFromChat={fanDisconnectedFromChat}
          hostName={hostFirstName || 'the host'}
        />
      )}
      <div id="remote-video" className={classes.remoteVideo}></div>
      <div id="local-video" className={classes.localVideo} />
      {currentFan && <RoundProgressBar userUpdatedAt={currentFan.updated_at} event={chitChat} />}
      {chitChatStatus === 'call-in-progress' && (
        <div className={classes.endCall} onClick={() => endCall({ chitChatId, chitChatRSVPs })} />
      )}
      {chitChatStatus === 'paused' && (
        <div
          className={classes.meetNextFan}
          onClick={() =>
            startNextChitChat({
              onlineChitChatUsersArray,
              chitChatId,
              startOfEvent: true,
              chitChatRSVPs,
              chitChat,
            })
          }
        />
      )}
    </div>
  )
}

export default ChitChatVideoRoom
