import React, { useEffect, useState, useRef } from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/styles'
import { useHistory } from 'react-router-dom'
import { useQuery, useMutation } from '@apollo/react-hooks'

import { InVideoBottomControlPanel, VideoRouter, RoundProgressBar, VideoRoomSidebar } from '.'
import { Loading, ChatBox } from '../../common'
import { getMyRoundPartner } from '../../gql/queries'
import { updateEventUsersLastSeen } from '../../gql/mutations'
import { getToken } from '../../helpers'
import {
  useAppContext,
  useEventContext,
  useTwilioContext,
  useUserContext,
  useUserEventStatusContext,
} from '../../context'
import { useTwilio, useIsUserActive } from '../../hooks'

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
    width: '200px',
    position: 'absolute',
    top: '3%',
    right: '1%',
    left: 'auto',
    bottom: 'auto',
    zIndex: 99,
    opacity: 0,
    transition: '.6s',
    '&.showControls, &:hover': {
      transition: 'opacity 0.6s',
      opacity: 1,
    },
    '& video': {
      borderRadius: 4,
      width: '200px',
    },
  },

  cameraDisabledWrapper: {
    height: '100vh',
  },
}))

const VideoRoom = ({ match }) => {
  const { id: eventId } = match.params
  const classes = useStyles()
  const { appLoading } = useAppContext()
  const { user } = useUserContext()
  const { event } = useEventContext()
  const {
    personalChatMessagesWithCurrentPartner,
    numberOfUnreadMessagesFromMyPartner,
    setNumberOfReadMessagesFromMyPartner,
    setUserEventStatus,
    userEventStatus,
  } = useUserEventStatusContext()
  const { setHasPartnerAndIsConnecting, myRound, setMyRound } = useTwilioContext()
  const { id: event_id, current_round, status: eventStatus } = event
  const { id: userId, tags_users: myTagsArray } = user
  const { startTwilio } = useTwilio()
  const [token, setToken] = useState(null)
  const [room, setRoom] = useState(null)
  const [userUpdatedAt, setUserUpdatedAt] = useState(null)
  const [chatIsOpen, setChatIsOpen] = useState(false)
  const history = useHistory()
  const eventSet = Object.keys(event).length > 1
  const eventStatusRef = useRef()
  const showControls = useIsUserActive()

  const [updateEventUsersLastSeenMutation] = useMutation(updateEventUsersLastSeen, {
    variables: {
      now: null,
      user_id: userId,
      event_id: eventId,
    },
    skip: !userId || !eventId,
  })

  const { data: myRoundPartnerData, loading: myRoundPartnerDataLoading } = useQuery(
    getMyRoundPartner,
    {
      variables: {
        user_id: userId,
        event_id,
        round: current_round,
      },
      fetchPolicy: 'network-only',
      skip:
        !userId || !eventSet || (eventStatusRef && eventStatusRef.current === 'in-between-rounds'),
    }
  )

  const toggleChat = () => {
    setChatIsOpen((prevState) => {
      if (prevState === true) {
        if (
          personalChatMessagesWithCurrentPartner &&
          personalChatMessagesWithCurrentPartner.length
        ) {
          setNumberOfReadMessagesFromMyPartner(
            personalChatMessagesWithCurrentPartner.filter(
              (message) => message.recipient_id === userId && message.read
            ).length
          )
        }
      }
      return !prevState
    })
  }

  // Redirect back to /event/id if the event has not started
  useEffect(() => {
    if (eventSet) {
      const { status } = event

      if (status === 'not-started') {
        return history.push(`/events/${eventId}`)
      }

      if (status === 'group-video-chat') {
        return history.push(`/events/${eventId}/group-video-chat`)
      }
      // we will hit this when the user is on the Thumbing screen, then new assignments are made
      // and there are no new pairings left, and we end the event
      if (status === 'complete') {
        return history.push(`/events/${eventId}/event-complete`)
      }
    }
  }, [event, userId])

  useEffect(() => {
    if (userEventStatus === 'sitting out') {
      history.push(`/events/${eventId}/lobby`)
    }
  }, [userEventStatus])

  // call last seen one last time when VideoRoom renders
  // this ensures when you refresh your userObject gets updated
  // and the roundProgressBar will be correct
  useEffect(() => {
    if (userId && room) {
      const asyncUpdateLastSeen = async () => {
        try {
          const lastSeenUpdated = await updateEventUsersLastSeenMutation()

          console.log('I set last on event_users to null')
          setUserUpdatedAt(lastSeenUpdated.data.update_event_users.returning[0].updated_at)
        } catch (err) {
          console.log(err)
        }
      }
      asyncUpdateLastSeen()
    }
  }, [userId, room])

  // After the getMyRoundById, if there is a response, setMyRound
  useEffect(() => {
    if (!myRoundPartnerDataLoading && myRoundPartnerData) {
      console.log('myRoundPartnerData ->', myRoundPartnerData)
      console.log('myRoundPartnerData.partners ->', myRoundPartnerData.partners)
      // if you're on this page and you don't have roundData, you either
      // 1. arrived late
      // 2. didn't get put into matching algorithm since your camera is off
      setMyRound(myRoundPartnerData.partners[0] || 'no-assignment')
      // TODO double check partners.length and not partners[0].length
      if (!myRoundPartnerData.partners.length) {
        setUserEventStatus('came late')
        setMyRound(null)
        history.push(`/events/${eventId}/lobby`)
      }

      if (myRoundPartnerData.partners.length && myRoundPartnerData.partners[0].left_chat !== null) {
        setUserEventStatus('left chat')
        setMyRound(null)
        history.push(`/events/${eventId}/lobby`)
      }
    }
  }, [myRoundPartnerDataLoading, myRoundPartnerData])

  // After getting myRound from the query above, we get the twilio token
  // RoomId (which is the id of your round) and your userId are needed
  // to get twilio token
  useEffect(() => {
    if (myRound) {
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
      } else if (event.status !== 'in-between-rounds') {
        setUserEventStatus('no partner')
        setMyRound(null)
        history.push(`/events/${eventId}/lobby`)
      }
    }
  }, [myRound])

  // After getting your token you get the permissions and create localTracks
  // You also get your room
  useEffect(() => {
    if (token) {
      const setupRoom = async () => {
        console.log('calling CONNECT')
        const localStoragePreferredVideoId = localStorage.getItem('preferredVideoId')
        const localStoragePreferredAudioId = localStorage.getItem('preferredAudioId')
        const audioDevice =
          process.env.NODE_ENV === 'production' ? { deviceId: localStoragePreferredAudioId } : false

        console.log('process.env.NODE_ENV', process.env.NODE_ENV)
        console.log('audioDevice', audioDevice)

        const myRoom = await connect(token, {
          maxAudioBitrate: 16000,
          video: { deviceId: localStoragePreferredVideoId },
          audio: audioDevice,
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
      <VideoRouter
        eventId={event_id}
        myRound={myRound}
        eventStatus={eventStatus}
        setUserEventStatus={setUserEventStatus}
      />
      <VideoRoomSidebar event={event} myRound={myRound} myTagsArray={myTagsArray} userId={userId} />
      <div className={classes.videoWrapper}>
        <div id="local-video" className={`${clsx(classes.myVideo, { showControls })}`} />
        <div id="remote-video" className={classes.mainVid} />
        {myRoundPartnerData && myRoundPartnerData.partners.length && chatIsOpen ? (
          <ChatBox
            chatIsOpen={chatIsOpen}
            messages={personalChatMessagesWithCurrentPartner}
            myRound={myRoundPartnerData.partners[0]}
            toggleChat={toggleChat}
          />
        ) : null}
        {userUpdatedAt && <RoundProgressBar userUpdatedAt={userUpdatedAt} event={event} />}
        <InVideoBottomControlPanel
          chatIsOpen={chatIsOpen}
          numberOfUnreadMessagesFromMyPartner={numberOfUnreadMessagesFromMyPartner}
          myRound={myRound}
          toggleChat={toggleChat}
        />
      </div>
    </div>
  )
}

export default VideoRoom
