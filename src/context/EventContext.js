import React, { useEffect, createContext, useContext } from 'react'

import { useSubscription } from '@apollo/react-hooks'
import { useImmer } from 'use-immer'
import { useHistory } from 'react-router-dom'
import { useAppContext } from '.'
import { listenToEvent, listenToEventChatMessages } from '../gql/subscriptions'

const EventContext = createContext()

const defaultState = {
  // eventId is for event subscriptions
  eventId: null,
  event: {},
  eventChatMessages: [],
  numberOfReadChatMessages: 0,
  numberOfUnreadChatMessages: 0,
}

const useEventContext = () => {
  const [state, dispatch] = useContext(EventContext)

  if (dispatch === undefined) {
    throw new Error('Must have dispatch defined')
  }

  const resetEvent = () => {
    dispatch((draft) => {
      draft.event = {}
    })
  }

  // LETS TRY TO GET RID OF THIS
  const setEventId = (eventId) => {
    dispatch((draft) => {
      draft.eventId = eventId
    })
  }

  const setNumberOfReadChatMessages = (readMessagesCount) => {
    dispatch((draft) => {
      draft.numberOfReadChatMessages = readMessagesCount
    })
  }

  return {
    ...state,
    resetEvent,
    setEventId,
    setNumberOfReadChatMessages,
  }
}

const EventProvider = ({ children }) => {
  // TODO shouldn't this not render at all if we're on a chitchat?
  const [state, dispatch] = useImmer({ ...defaultState })
  const { setAppLoading } = useAppContext()
  const { pathname } = window.location
  const { event, eventChatMessages, numberOfReadChatMessages } = state
  const eventRegex = /\/events\/\d+/
  const history = useHistory()
  const userOnEventPage = Boolean(pathname.match(eventRegex))
  console.log('🚀 ~ EventProvider ~ userOnEventPage', userOnEventPage)
  const userOnLobbyOrGroupChat = pathname.includes('lobby') || pathname.includes('group-video-chat')
  const pathnameArray = pathname.split('/')
  // TODO this check should be better ... it still thinks its an eventId if we're on a chitchat
  const eventId = parseInt(pathnameArray[2], 10)

  // subscribe to the Event only if we have an eventId
  const { data: eventData } = useSubscription(listenToEvent, {
    variables: {
      event_id: eventId,
    },
    skip: !eventId || !userOnEventPage,
  })

  const { data: chatMessages } = useSubscription(listenToEventChatMessages, {
    variables: {
      event_id: eventId,
    },
    skip: !eventId || !userOnEventPage,
  })

  useEffect(() => {
    if (event.status === 'in-between-rounds' && window.room) {
      console.log('disconnecting from rooM!!!!')
      window.room.disconnect()
    }
  }, [event.status])

  useEffect(() => {
    // if on event page and its a valid event
    if (userOnEventPage && eventData) {
      // event doesn't exist - redirect user
      if (!eventData.events.length) {
        setAppLoading(false)
        return history.push('/events')
      }
      // cases to set event data:
      // 1) no event data set yet
      // 2) incoming data from subscription is different from existing
      const existingData = JSON.stringify(event)
      const incomingData = JSON.stringify(eventData.events[0])

      if (existingData !== incomingData) {
        const eventWasReset =
          event.status &&
          event.status !== 'not-started' &&
          eventData.events[0].status === 'not-started'
        if (eventWasReset) {
          window.location.reload()
        }
        dispatch((draft) => {
          draft.event = eventData.events[0]
        })
        return setAppLoading(false)
      }
    }
  }, [eventData, dispatch, event, userOnEventPage, history])

  useEffect(() => {
    if (userOnLobbyOrGroupChat && chatMessages) {
      const existingChatMessages = JSON.stringify(eventChatMessages)
      const incomingChatMessages = JSON.stringify(chatMessages.event_group_chat_messages)

      if (existingChatMessages !== incomingChatMessages) {
        dispatch((draft) => {
          draft.eventChatMessages = chatMessages.event_group_chat_messages
          draft.numberOfUnreadChatMessages =
            chatMessages.event_group_chat_messages.length - numberOfReadChatMessages
        })
      }
    }
  }, [chatMessages, userOnLobbyOrGroupChat])

  useEffect(() => {
    if (numberOfReadChatMessages) {
      dispatch((draft) => {
        draft.numberOfUnreadChatMessages =
          chatMessages.event_group_chat_messages.length - numberOfReadChatMessages
      })
    }
  }, [numberOfReadChatMessages])

  return <EventContext.Provider value={[state, dispatch]}>{children}</EventContext.Provider>
}

export { useEventContext, EventProvider }
