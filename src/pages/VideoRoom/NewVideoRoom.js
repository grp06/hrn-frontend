import React, { useEffect, useState, useRef } from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/styles'
import { useHistory } from 'react-router-dom'
import { useQuery } from '@apollo/react-hooks'

import { ConnectionIssuesButton, NewVideoRouter, RoundProgressBar, VideoRoomSidebar } from '.'
import { Loading } from '../../common'
import { getMyRoundPartner } from '../../gql/queries'
import { getToken } from '../../helpers'
import {
  useAppContext,
  useEventContext,
  useUserContext,
  useUserEventStatusContext,
} from '../../context'
import { useTwilio, useGetCameraAndMicStatus, useIsUserActive } from '../../hooks'

const { connect } = require('twilio-video')

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
      width: '100vw',
      height: '100vh',
      objectFit: 'cover',
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

const NewVideoRoom = ({ match }) => {
  const { id: eventId } = match.params
  const classes = useStyles()
  const { appLoading } = useAppContext()
  const { user } = useUserContext()
  const { event, setHasPartnerAndIsConnecting } = useEventContext()
  const { setUserEventStatus } = useUserEventStatusContext()
  const { id: userId } = user
  const { startTwilio } = useTwilio()
  const [token, setToken] = useState(null)
  const [myRound, setMyRound] = useState(null)
  const [room, setRoom] = useState(null)
  const history = useHistory()
  const eventSet = Object.keys(event).length > 1
  const eventStatusRef = useRef()
  const hasCheckedCamera = useRef()
  const showControls = useIsUserActive()

  useGetCameraAndMicStatus(hasCheckedCamera.current)
  hasCheckedCamera.current = true
  const {
    data: myRoundPartnerData,
    loading: myRoundPartnerDataLoading,
    error: myRoundPartnerDataError,
  } = useQuery(getMyRoundPartner, {
    variables: {
      user_id: userId,
      event_id: event.id,
    },
    skip:
      !userId || !eventSet || (eventStatusRef && eventStatusRef.current === 'in-between-rounds'),
  })

  // Redirect back to /event/id if the event has not started
  useEffect(() => {
    if (eventSet) {
      const { status } = event

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
    if (!myRoundPartnerDataLoading && myRoundPartnerData) {
      console.log(myRoundPartnerData)

      // if you're on this page and you don't have roundData, you either
      // 1. arrived late
      // 2. didn't get put into matching algorithm since your camera is off
      setMyRound(myRoundPartnerData.partners[0] || 'no-assignment')
      // TODO double check partners.length and not partners[0].length
      if (!myRoundPartnerData.partners.length) {
        setUserEventStatus('came late')
        history.push(`/events/${eventId}/lobby`)
      }

      console.log('NewVideoRoom -> myRoundPartnerData', myRoundPartnerData)
      if (myRoundPartnerData.partners.length && myRoundPartnerData.partners[0].left_chat) {
        setUserEventStatus('left chat')
        history.push(`/events/${eventId}/lobby`)
      }
    }
  }, [myRoundPartnerDataLoading, myRoundPartnerData])

  // After getting myRound from the query above, we get the twilio token
  // RoomId (which is the id of your round) and your userId are needed
  // to get twilio token
  useEffect(() => {
    if (myRound) {
      console.log(myRound)
      const hasPartner = myRound && myRound.partner_id

      const myIdIsSmaller = myRound.partner_id > myRound.user_id
      const uniqueRoomName = myIdIsSmaller
        ? `${eventId}-${myRound.user_id}-${myRound.partner_id}`
        : `${eventId}-${myRound.partner_id}-${myRound.user_id}`
      if (
        hasPartner &&
        eventSet &&
        event.status !== 'in-between-rounds'
        //   event.current_round === myRound.round_number
      ) {
        const getTwilioToken = async () => {
          const res = await getToken(uniqueRoomName, userId).then((response) => response.json())
          console.log('getTwilioToken res ->', res)
          setToken(res.token)
        }
        getTwilioToken()
        setUserEventStatus('in chat')
      } else {
        setUserEventStatus('no partner')
        history.push(`/events/${eventId}/lobby`)
      }
    }
  }, [myRound, event])

  // After getting your token you get the permissions and create localTracks
  // You also get your room
  useEffect(() => {
    if (token) {
      const setupRoom = async () => {
        console.log('calling CONNECT')
        const localStoragePreferredVideoId = localStorage.getItem('preferredVideoId')
        const localStoragePreferredAudioId = localStorage.getItem('preferredAudioId')

        const myRoom = await connect(token, {
          maxAudioBitrate: 16000,
          video: { deviceId: localStoragePreferredVideoId },
          audio:
            process.env.NODE_ENV === 'production'
              ? { deviceId: localStoragePreferredAudioId }
              : false,
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
      <NewVideoRouter myRound={myRound} />
      <VideoRoomSidebar
        event={event}
        myRound={myRound}
        userId={userId}
        ConnectionIssuesButton={<ConnectionIssuesButton myRound={myRound} />}
      />
      <div className={classes.videoWrapper}>
        <div id="local-video" className={`${clsx(classes.myVideo, { showControls })}`} />
        <div id="remote-video" className={classes.mainVid} />
        {/* {myRound !== 'no-assignment' ? (
          <RoundProgressBar
            myRound={myRound}
            event={event}
            hasPartnerAndIsConnecting={hasPartnerAndIsConnecting}
          />
        ) : null} */}
      </div>
    </div>
  )
}

export default NewVideoRoom
