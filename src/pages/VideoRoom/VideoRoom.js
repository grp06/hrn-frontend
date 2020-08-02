import React, { useEffect, useState, useRef } from 'react'
import clsx from 'clsx'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/styles'
import { useHistory } from 'react-router-dom'
import { useQuery } from '@apollo/react-hooks'

import { VideoRouter, RoundProgressBar } from '.'
import { ConnectingToSomeone } from './waitingRoomScreens'
import { Loading, CameraDisabledBanner } from '../../common'
import { getMyRoundById } from '../../gql/queries'
import { getToken } from '../../helpers'
import { useAppContext } from '../../context/useAppContext'
import { useTwilio, useGetCameraAndMicStatus, useIsUserActive } from '../../hooks'

const { createLocalTracks, connect } = require('twilio-video')

const useStyles = makeStyles((theme) => ({
  videoWrapper: {
    background: theme.palette.common.blackBody,
  },
  screenOverlay: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    zIndex: 99,
    width: '100vw',
    height: '100vh',
  },
  mainVid: {
    width: '100%',
    display: 'flex',
    '& video': {
      width: '100%',
      height: 'calc(100vh)',
    },
  },
  myVideo: {
    width: '150px',
    position: 'absolute',
    top: '79px',
    right: '15px',
    zIndex: 99,
    opacity: 0,
    transition: '.6s',
    '&.showControls, &:hover': {
      transition: 'opacity 0.6s',
      opacity: 1,
    },
    '& video': {
      borderRadius: 4,
      width: '150px',
    },
  },

  cameraDisabledWrapper: {
    height: '100vh',
  },
}))

const VideoRoom = ({ match }) => {
  const { id: eventId } = match.params
  const classes = useStyles()

  const {
    app,
    user,
    event,
    twilio,
    setHasPartnerAndIsConnecting,
    setCameraAndMicPermissions,
  } = useAppContext()
  const { userId } = user
  const { appLoading, permissions } = app
  const { hasPartnerAndIsConnecting } = twilio

  const { startTwilio } = useTwilio()

  const [token, setToken] = useState(null)
  const [myRound, setMyRound] = useState(null)
  const [room, setRoom] = useState(null)
  const [isGUMErrorModalActive, setIsGUMErrorModalActive] = useState(false)
  const history = useHistory()
  const eventSet = Object.keys(event).length > 1
  const eventStatusRef = useRef()
  const hasCheckedCamera = useRef()
  const showControls = useIsUserActive()

  useGetCameraAndMicStatus(hasCheckedCamera.current)
  hasCheckedCamera.current = true

  const { data: myRoundData, loading: myRoundDataLoading, error: myRoundDataError } = useQuery(
    getMyRoundById,
    {
      variables: {
        round_number: event.current_round,
        user_id: userId,
        event_id: event.id,
      },
      skip:
        !userId || !eventSet || (eventStatusRef && eventStatusRef.current === 'in-between-rounds'),
    }
  )

  // Redirect back to /event/id if the event has not started
  useEffect(() => {
    if (eventSet) {
      const { status } = event

      if (!userId) {
        history.push('/')
      }
      if (status === 'not-started') {
        return history.push(`/events/${eventId}`)
      }

      // we will hit this when the user is on the Thumbing screen, then new assignments are made
      // and there are no new pairings left, and we end the event
      if (status === 'complete') {
        return history.push(`/events/${eventId}/event-complete`)
      }
    }
  }, [event, userId])

  // After the getMyRoundById, if there is a response, setMyRound
  useEffect(() => {
    if (!myRoundDataLoading && myRoundData) {
      // if you're on this page and you don't have roundData, you either
      // 1. arrived late
      // 2. didn't get put into matching algorithm since your camera is off
      setMyRound(myRoundData.rounds[0] || 'no-assignment')
    }
  }, [myRoundDataLoading, myRoundData])

  // After getting myRound from the query above, we get the twilio token
  // RoomId (which is the id of your round) and your userId are needed
  // to get twilio token
  useEffect(() => {
    const hasPartner = myRound && myRound.partnerX_id && myRound.partnerY_id
    if (
      hasPartner &&
      eventSet &&
      event.status !== 'in-between-rounds' &&
      event.current_round === myRound.round_number
    ) {
      const getTwilioToken = async () => {
        const res = await getToken(`${eventId}-${myRound.id}`, userId).then((response) =>
          response.json()
        )

        setToken(res.token)
      }
      getTwilioToken()
    }
  }, [myRound, event])

  // After getting your token you get the permissions and create localTracks
  // You also get your room
  useEffect(() => {
    if (token) {
      const setupRoom = async () => {
        let localTracks
        try {
          console.log('bout to create local tracks')
          localTracks = await createLocalTracks({
            video: true,
            audio: process.env.NODE_ENV === 'production',
          })
        } catch (err) {
          return setIsGUMErrorModalActive(true)
        }

        console.log('calling CONNECT')
        const myRoom = await connect(token, {
          tracks: localTracks,
        })
        console.log('setting room')
        setRoom(myRoom)
      }
      setupRoom()
    }
  }, [token])

  useEffect(() => {
    if (room) {
      console.warn('starting twilio')
      setHasPartnerAndIsConnecting(true)
      startTwilio(room)
    }
  }, [room])

  if (appLoading || !eventSet || !myRound) {
    return <Loading />
  }

  // If you are switching from room-in-progress to in-between-rounds
  // then we want to clear your room and token
  const { status: statusFromSubscription } = event

  if (statusFromSubscription !== eventStatusRef.current) {
    if (
      statusFromSubscription === 'room-in-progress' &&
      eventStatusRef.current === 'in-between-rounds'
    ) {
      setToken(null)
      setRoom(null)
      eventStatusRef.current = statusFromSubscription
      return null
    }
    eventStatusRef.current = statusFromSubscription
  }

  return (
    <div>
      {isGUMErrorModalActive && (
        <Grid
          className={classes.cameraDisabledWrapper}
          container
          direction="column"
          justify="center"
        >
          <CameraDisabledBanner
            permissions={permissions}
            setCameraAndMicPermissions={setCameraAndMicPermissions}
          />
        </Grid>
      )}
      <VideoRouter myRound={myRound} />
      <div className={classes.videoWrapper}>
        {hasPartnerAndIsConnecting && (
          <div className={classes.screenOverlay}>
            <ConnectingToSomeone />
          </div>
        )}

        <div id="local-video" className={`${clsx(classes.myVideo, { showControls })}`} />
        <div id="remote-video" className={classes.mainVid} />
        {myRound !== 'no-assignment' ? (
          <RoundProgressBar
            myRound={myRound}
            event={event}
            hasPartnerAndIsConnecting={hasPartnerAndIsConnecting}
          />
        ) : null}
      </div>
    </div>
  )
}

export default VideoRoom