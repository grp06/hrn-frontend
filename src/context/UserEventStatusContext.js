import React, { useCallback, useEffect, createContext, useContext } from 'react'

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
  numberOfReadMessagesFromMyPartner: 0,
  numberOfUnreadMessagesFromMyPartner: 0,
  onlineEventUsers: [],
  personalChatMessagesWithCurrentPartner: [],
  userEventStatus: 'waiting for match',
  userHasEnabledCameraAndMic: false,
  icebreakerQuestions: [
    { category: 'Profound 🙇‍♀️', question: 'What makes your heart glow?' },
    { category: 'Profound 🙇‍♀️', question: 'What memory instantly makes you smile?' },
    { category: 'Profound 🙇‍♀️', question: 'What would you like to attract more of in your life?' },
    {
      category: 'Workplace 💼',
      question: 'Who is your favorite person to work with in the company?',
    },
    { category: 'Workplace 💼', question: 'What do you most like about your job and why? ' },
  ],
}

const useUserEventStatusContext = () => {
  const [state, dispatch] = useContext(UserEventStatusContext)

  if (dispatch === undefined) {
    throw new Error('Must have dispatch defined')
  }

  const removeIcebreakerQuestion = (index) => {
    dispatch((draft) => {
      draft.icebreakerQuestions = draft.icebreakerQuestions.splice(index, 1)
    })
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
    removeIcebreakerQuestion,
    setNumberOfReadMessagesFromMyPartner,
    setUserEventStatus,
    setUserHasEnabledCameraAndMic,
  }
}

const UserEventStatusProvider = ({ children }) => {
  const [state, dispatch] = useImmer({ ...defaultState })
  const {
    personalChatMessagesWithCurrentPartner,
    userEventStatus,
    userHasEnabledCameraAndMic,
  } = state
  const history = useHistory()
  const { user, setUserUpdatedAt, userInEvent } = useUserContext()
  const { event } = useEventContext()
  const { myRound } = useTwilioContext()
  const { id: eventId } = event
  const { id: userId } = user
  const { partner_id } = (myRound && Object.keys(myRound).length && myRound) || {}
  const pushUserToLobby = useCallback(() => {
    history.push(`/events/${event.id}/lobby`)
  }, [event.id, history])

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
      pushUserToLobby()
    }
  }, [pushUserToLobby, userEventStatus])

  // check the online user for events
  useEffect(() => {
    if (onlineEventUsersData) {
      dispatch((draft) => {
        draft.onlineEventUsers = onlineEventUsersData.online_event_users
      })
    }
  }, [onlineEventUsersData, dispatch])

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
  }, [userId, userEventStatus, userInEvent, userHasEnabledCameraAndMic]) //eslint-disable-line

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
  }, [chatMessages, dispatch, personalChatMessagesWithCurrentPartner, partner_id, userId])

  return (
    <UserEventStatusContext.Provider value={[state, dispatch]}>
      {children}
    </UserEventStatusContext.Provider>
  )
}

export { useUserEventStatusContext, UserEventStatusProvider }
