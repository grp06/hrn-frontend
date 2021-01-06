import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/styles'
import { useHistory } from 'react-router-dom'
import { useSubscription } from '@apollo/react-hooks'

import {
  BottomControlPanel,
  CameraAndMicSetupScreen,
  EventCountdown,
  NextRoundIn,
  LobbyContent,
} from '.'
import {
  useAppContext,
  useEventContext,
  useUserContext,
  useUserEventStatusContext,
} from '../../context'
import { EventChatBox, Loading } from '../../common'
import { listenToPartnersTable } from '../../gql/subscriptions'
import { getTimeUntilEvent } from '../../utils'

// the overflow hidden in broadcastContainer is to help hide the scrollbar
const useStyles = makeStyles((theme) => ({
  pageContainer: {
    overflowX: 'hidden',
    overflowY: 'hidden',
  },
}))

const Lobby = () => {
  const classes = useStyles()
  const history = useHistory()
  const { appLoading } = useAppContext()
  const { event, eventChatMessages } = useEventContext()
  const { user, setUserInEvent } = useUserContext()
  const [chatIsOpen, setChatIsOpen] = useState(true)
  const {
    onlineEventUsers,
    setUserEventStatus,
    setUserHasEnabledCameraAndMic,
    userEventStatus,
    userHasEnabledCameraAndMic,
  } = useUserEventStatusContext()
  const {
    current_round: round,
    event_users,
    host_id: hostId,
    id: eventId,
    round_length,
    start_at: eventStartTime,
    status: eventStatus,
    updated_at: eventUpdatedAt,
  } = event
  const { id: user_id, name: usersName } = user

  // only do this subscription if you came late or left the chat
  // TODO optimize by not subscribing with less than two minutes
  const { data: myRoundData } = useSubscription(listenToPartnersTable, {
    variables: {
      event_id: eventId,
      user_id: user_id,
      round,
    },
    skip:
      ((userEventStatus === 'sitting out' || userEventStatus === 'reported') &&
        eventStatus === 'room-in-progress') ||
      eventStatus === 'not-started',
  })

  useEffect(() => {
    setUserInEvent(true)
  }, [])

  useEffect(() => {
    if (getTimeUntilEvent(eventStartTime) > 900000) {
      history.push(`/events/${eventId}`)
    }
  }, [eventStartTime])

  // some redirecting stuff
  useEffect(() => {
    if (event_users && event_users.length && user_id) {
      const alreadyAttending = event_users.find((u) => u.user.id === user_id)
      if (!alreadyAttending) {
        history.push(`/events/${eventId}`)
      }
    }
    if (eventStatus === 'group-video-chat') {
      return history.push(`/events/${eventId}/group-video-chat`)
    }
    if (eventStatus === 'complete') {
      history.push(`/events/${eventId}/event-complete`)
    }
  }, [event_users, eventStatus, user_id])

  // redirect you when you have a partner
  // the round ===1 and waiting for match is to make sure that you get pushed into
  // videoRoom for round 1 even if you are the odd one out. That way userEventStatus
  // gets set properly and you get the correct broadcast screen
  useEffect(() => {
    if (
      (eventStatus === 'room-in-progress' &&
        userEventStatus !== 'sitting out' &&
        myRoundData &&
        myRoundData.partners.length &&
        userHasEnabledCameraAndMic) ||
      (round === 1 && userEventStatus === 'waiting for match')
    ) {
      console.log('myRoundData ->', myRoundData)
      console.log('userEventStatus ->', userEventStatus)
      history.push(`/events/${eventId}/video-room`)
    }
  }, [eventStatus, userEventStatus, myRoundData])

  if (appLoading || Object.keys(event).length < 2 || Object.keys(user).length < 2) {
    return <Loading />
  }

  if (!userHasEnabledCameraAndMic) {
    return <CameraAndMicSetupScreen usersName={usersName} />
  }

  return (
    <div className={classes.pageContainer}>
      {eventStatus === 'not-started' ? <EventCountdown eventStartTime={eventStartTime} /> : null}
      {eventStatus !== 'not-started' && eventStatus !== 'pre-event' ? (
        <NextRoundIn
          currentRound={round}
          eventStatus={eventStatus}
          eventUpdatedAt={eventUpdatedAt}
          roundLength={round_length}
        />
      ) : null}
      <LobbyContent
        event={event}
        onlineEventUsers={onlineEventUsers}
        setUserEventStatus={setUserEventStatus}
        userEventStatus={userEventStatus}
        user={user}
      />
      {chatIsOpen ? (
        <EventChatBox
          eventId={eventId}
          hostId={hostId}
          messages={eventChatMessages}
          userId={user_id}
        />
      ) : null}
      <BottomControlPanel
        chatIsOpen={chatIsOpen}
        event={event}
        setUserHasEnabledCameraAndMic={setUserHasEnabledCameraAndMic}
        toggleChat={() => setChatIsOpen((prevState) => !prevState)}
        userId={user_id}
        userHasEnabledCameraAndMic={userHasEnabledCameraAndMic}
      />
    </div>
  )
}

export default Lobby
