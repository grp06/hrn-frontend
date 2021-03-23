import React, { useEffect, useState } from 'react'
import { useSubscription } from '@apollo/react-hooks'
import { useHistory } from 'react-router-dom'

import {
  BottomControlPanel,
  ChatRequestedModal,
  CameraAndMicSetupScreen,
  EventCountdown,
  NextRoundIn,
  LobbyContent,
} from '.'
import { useEventContext, useUserContext, useUserEventStatusContext } from '../../context'
import { EventChatBox, Loading } from '../../common'
import { listenToPartnersTable } from '../../gql/subscriptions'
import { getTimeUntilEvent } from '../../utils'

const Lobby = () => {
  const history = useHistory()
  const {
    event,
    eventChatMessages,
    numberOfUnreadChatMessages,
    setNumberOfReadChatMessages,
    eventContextLoading,
  } = useEventContext()
  const { user, userContextLoading } = useUserContext()
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
    round_length,
    start_at: eventStartTime,
    status: eventStatus,
    updated_at: eventUpdatedAt,
    id: eventId,
  } = event
  const { id: user_id, name: usersName } = user
  const [chatIsOpen, setChatIsOpen] = useState(true)
  const [chatWasRequested, setChatWasRequested] = useState(false)

  // only do this subscription if you came late or left the chat
  // TODO optimize by not subscribing with less than two minutes
  // const skipListenToPartnersTableSub =
  //   !user_id ||
  //   !eventId ||
  //   !round ||
  //   eventStatus === 'not-started' ||
  //   eventStatus === 'pre-event' ||
  //   ((userEventStatus === 'sitting out' || userEventStatus === 'reported') &&
  //     eventStatus === 'room-in-progress')

  const skipListenToPartnersTableSub = !user_id || !eventId

  const { data: myRoundData } = useSubscription(listenToPartnersTable, {
    variables: {
      event_id: eventId,
      user_id: user_id,
      round: 1,
    },
    skip: skipListenToPartnersTableSub,
  })

  const toggleChat = () => {
    setChatIsOpen((prevState) => {
      if (prevState === true && eventChatMessages?.length) {
        setNumberOfReadChatMessages(eventChatMessages.length)
      }
      return !prevState
    })
  }

  const appLoading = userContextLoading || eventContextLoading

  useEffect(() => {
    if (getTimeUntilEvent(eventStartTime) > 900000) {
      history.push(`/events/${eventId}`)
    }
  }, [eventId, eventStartTime, history])

  // some redirecting stuff
  useEffect(() => {
    if (!appLoading) {
      const alreadyAttending = event_users.find((u) => u.user.id === user_id)
      if (!user_id || !alreadyAttending) {
        history.push(`/events/${eventId}`)
      }
    }

    switch (eventStatus) {
      case 'group-video-chat':
        return history.push(`/events/${eventId}/group-video-chat`)
      case 'complete':
        return history.push(`/events/${eventId}/event-complete`)
      default:
      // do nothing
    }
  }, [eventId, event_users, eventStatus, history, user_id, appLoading])

  // redirect you when you have a partner
  // the round ===1 and waiting for match is to make sure that you get pushed into
  // videoRoom for round 1 even if you are the odd one out. That way userEventStatus
  // gets set properly and you get the correct broadcast screen
  useEffect(() => {
    if (
      (eventStatus === 'room-in-progress' &&
        userEventStatus !== 'sitting out' &&
        myRoundData?.partners.length &&
        myRoundData?.partners[myRoundData.partners.length - 1].chat_request !== 'pending' &&
        myRoundData?.partners[myRoundData.partners.length - 1].chat_request !== 'declined' &&
        userHasEnabledCameraAndMic) ||
      (round === 1 && userEventStatus === 'waiting for match')
    ) {
      history.push(`/events/${eventId}/video-room`)
    }
  }, [
    eventId,
    eventStatus,
    history,
    myRoundData,
    round,
    userEventStatus,
    userHasEnabledCameraAndMic,
  ])

  useEffect(() => {
    if (
      myRoundData?.partners.length &&
      myRoundData?.partners[myRoundData.partners.length - 1].chat_request === 'pending'
    ) {
      console.log('hey i got reuested')
      console.log('💕 myRoundData ->', myRoundData)
      setChatWasRequested(myRoundData.partners[myRoundData.partners.length - 1])
    }
  }, [myRoundData])

  if (userContextLoading || eventContextLoading) {
    return <Loading />
  }

  if (!userHasEnabledCameraAndMic) {
    return <CameraAndMicSetupScreen usersName={usersName} />
  }

  return (
    <div style={{ overflowX: 'hidden', overflowY: 'hidden' }}>
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
        eventId={eventId}
      />
      {chatIsOpen ? (
        <EventChatBox
          eventId={eventId}
          hostId={hostId}
          messages={eventChatMessages}
          toggleChat={toggleChat}
          userId={user_id}
        />
      ) : null}
      <BottomControlPanel
        chatIsOpen={chatIsOpen}
        event={event}
        numberOfUnreadChatMessages={numberOfUnreadChatMessages}
        setUserHasEnabledCameraAndMic={setUserHasEnabledCameraAndMic}
        toggleChat={toggleChat}
        userId={user_id}
        userHasEnabledCameraAndMic={userHasEnabledCameraAndMic}
      />
      {chatWasRequested ? <ChatRequestedModal /> : null}
    </div>
  )
}

export default Lobby
