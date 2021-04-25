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
  const [chatIsOpen, setChatIsOpen] = useState(false)
  const [chatRequests, setChatRequests] = useState([])
  const [chatRequestThatNeedsAResponse, setChatRequestThatNeedsAResponse] = useState(null)

  // only do this subscription if you came late or left the chat
  // TODO optimize by not subscribing with less than two minutes
  const skipListenToPartnersTableSub =
    !user_id ||
    !eventId ||
    !round ||
    eventStatus === 'not-started' ||
    eventStatus === 'pre-event' ||
    ((userEventStatus === 'sitting out' || userEventStatus === 'reported') &&
      eventStatus === 'room-in-progress')

  const { data: myRoundData } = useSubscription(listenToPartnersTable, {
    variables: {
      event_id: eventId,
      user_id: user_id,
      round,
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
    // if user is on the lobby and its >15 mins til the event, push them to the event route
    const fifteenMinutes = 900000
    if (getTimeUntilEvent(eventStartTime) > fifteenMinutes) {
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
  // the round === 1 and waiting for match is to make sure that you get pushed into
  // videoRoom for round 1 even if you are the odd one out. That way userEventStatus
  // gets set properly and you get the correct broadcast screen
  useEffect(() => {
    const eligibleForVideoRoom =
      eventStatus === 'room-in-progress' &&
      userEventStatus !== 'sitting out' &&
      userHasEnabledCameraAndMic

    const acceptedChatRequest = myRoundData?.partners.find(
      (chatRequest) => chatRequest.chat_request === 'accepted'
    )

    const hasValidPartner =
      myRoundData && myRoundData.partners[0] && myRoundData.partners[0].chat_request === null

    if (
      (eligibleForVideoRoom && acceptedChatRequest) ||
      (eligibleForVideoRoom && hasValidPartner) ||
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
    if (myRoundData?.partners.length) {
      const requestsThatAreNotNull = myRoundData.partners.filter(
        (partnerRow) => partnerRow.chat_request !== null
      )
      const requestsThatArePending = myRoundData.partners.filter(
        (partnerRow) => partnerRow.chat_request === 'pending'
      )

      setChatRequests(requestsThatAreNotNull)

      // set the last request (which would be the first one made) just in case there are
      // currently two requests that need to be responded to
      if (requestsThatArePending?.length) {
        setChatRequestThatNeedsAResponse(requestsThatArePending[0])
      } else {
        setChatRequestThatNeedsAResponse(null)
      }
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
        chatRequests={chatRequests}
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
      {chatRequestThatNeedsAResponse ? (
        <ChatRequestedModal chatRequest={chatRequestThatNeedsAResponse} />
      ) : null}
    </div>
  )
}

export default Lobby
