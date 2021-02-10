import React, { useEffect, createContext, useContext } from 'react'

import { useSubscription, useMutation } from '@apollo/react-hooks'
import { useImmer } from 'use-immer'
import { useHistory } from 'react-router-dom'
import { useUserContext, useEventContext, useTwilioContext } from '.'
import { updateEventUsersLastSeen } from '../gql/mutations'
import { constants } from '../utils'
import { listenToChatMessages, listenToOnlineEventUsers } from '../gql/subscriptions'

const { lastSeenDuration, bannedUserIds } = constants

const UserEventStatusContext = createContext()

// status could be
// no partner
// came late
// sitting out
// left chat
// in chat
// waiting for match
// reported
const defaultState = {
  userEventStatus: 'waiting for match',
  onlineEventUsers: [],
  userHasEnabledCameraAndMic: false,
  personalChatMessagesWithCurrentPartner: [],
  numberOfReadMessagesFromMyPartner: 0,
  numberOfUnreadMessagesFromMyPartner: 0,
}

const useUserEventStatusContext = () => {
  const [state, dispatch] = useContext(UserEventStatusContext)

  if (dispatch === undefined) {
    throw new Error('Must have dispatch defined')
  }

  const setNumberOfReadMessagesFromMyPartner = (readMessagesCount) => {
    dispatch((draft) => {
      draft.numberOfReadMessagesFromMyPartner = readMessagesCount
    })
  }

  const setUserEventStatus = (status) => {
    console.log('setUSerEventStatus ->', status)
    dispatch((draft) => {
      draft.userEventStatus = status
    })
  }

  const setUserHasEnabledCameraAndMic = (userHasEnabledCameraAndMic) => {
    dispatch((draft) => {
      draft.userHasEnabledCameraAndMic = userHasEnabledCameraAndMic
    })
  }

  return {
    ...state,
    setNumberOfReadMessagesFromMyPartner,
    setUserEventStatus,
    setUserHasEnabledCameraAndMic,
  }
}

const UserEventStatusProvider = ({ children }) => {
  const [state, dispatch] = useImmer({ ...defaultState })
  const {
    numberOfReadMessagesFromMyPartner,
    numberOfUnreadMessagesFromMyPartner,
    personalChatMessagesWithCurrentPartner,
    userEventStatus,
    userHasEnabledCameraAndMic,
  } = state
  const { user, setUserUpdatedAt, userInEvent } = useUserContext()
  const { event } = useEventContext()
  const { myRound } = useTwilioContext()
  const { id: eventId } = event
  const { id: userId } = user
  const { partner_id } = (myRound && Object.keys(myRound).length && myRound) || {}
  const history = useHistory()

  const [updateEventUsersLastSeenMutation] = useMutation(updateEventUsersLastSeen, {
    variables: {
      now: new Date().toISOString(),
      user_id: userId,
      event_id: eventId,
    },
    skip: !userId || !eventId,
  })

  const { data: onlineEventUsersData } = useSubscription(listenToOnlineEventUsers, {
    variables: {
      event_id: eventId,
    },
    skip: !eventId,
  })

  const { data: chatMessages } = useSubscription(listenToChatMessages, {
    variables: {
      user_id: userId,
      partner_id,
    },
    skip: !eventId || !partner_id,
  })

  // check if need to push back to lobby
  useEffect(() => {
    if (userEventStatus === 'no partner' || userEventStatus === 'late') {
      history.push(`/events/${event.id}/lobby`)
    }
  }, [userEventStatus])

  // check the online user for events
  useEffect(() => {
    if (onlineEventUsersData) {
      dispatch((draft) => {
        draft.onlineEventUsers = onlineEventUsersData.online_event_users
      })
    }
  }, [onlineEventUsersData])

  // update last_seen on the user object every X seconds so users show up as "online" for host
  useEffect(() => {
    if (
      userId &&
      userEventStatus !== 'in chat' &&
      userEventStatus !== 'sitting out' &&
      userInEvent &&
      userHasEnabledCameraAndMic
    ) {
      const interval = setInterval(async () => {
        console.log('last seen')
        try {
          if (!bannedUserIds.includes(userId)) {
            const lastSeenUpdated = await updateEventUsersLastSeenMutation()
            setUserUpdatedAt(lastSeenUpdated.data.update_event_users.returning[0].last_seen)
          }
        } catch (error) {
          console.log('interval -> error', error)
        }
      }, lastSeenDuration)
      return () => {
        clearInterval(interval)
      }
    }
  }, [userId, userEventStatus, userInEvent, userHasEnabledCameraAndMic])

  // whenever we get new messages, update the messages array and calculate the number of unread messages
  useEffect(() => {
    if (chatMessages && partner_id) {
      const existingChatMessages = JSON.stringify(personalChatMessagesWithCurrentPartner)
      const incomingChatMessages = JSON.stringify(chatMessages.personal_chat_messages)

      if (existingChatMessages !== incomingChatMessages) {
        const unreadMessagesSentToMe = chatMessages.personal_chat_messages.filter(
          (message) => message.recipient_id === userId && !message.read
        )
        dispatch((draft) => {
          draft.personalChatMessagesWithCurrentPartner = chatMessages.personal_chat_messages
          draft.numberOfUnreadMessagesFromMyPartner = unreadMessagesSentToMe.length
        })
      }
    }
  }, [chatMessages, partner_id])

  return (
    <UserEventStatusContext.Provider value={[state, dispatch]}>
      {children}
    </UserEventStatusContext.Provider>
  )
}

export { useUserEventStatusContext, UserEventStatusProvider }
