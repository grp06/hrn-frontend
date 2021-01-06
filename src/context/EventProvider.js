import React, { useEffect } from 'react'

import { useSubscription } from '@apollo/react-hooks'
import { useImmer } from 'use-immer'
import { useHistory } from 'react-router-dom'
import { useAppContext } from '.'
import { listenToEvent, listenToEventChatMessages } from '../gql/subscriptions'

const EventContext = React.createContext()

const defaultState = {
  // eventId is for event subscriptions
  eventId: null,
  event: {},
  eventChatMessages: null,
}

const EventProvider = ({ children }) => {
  const [state, dispatch] = useImmer({ ...defaultState })
  const { setAppLoading } = useAppContext()
  const { pathname } = window.location
  const { event, eventChatMessages } = state
  const eventRegex = /\/events\/\d+/
  const history = useHistory()
  const userOnEventPage = Boolean(pathname.match(eventRegex))
  const userOnLobbyOrGroupChat = pathname.includes('lobby') || pathname.includes('group-video-chat')
  const pathnameArray = pathname.split('/')
  const eventId = parseInt(pathnameArray[2], 10)

  // subscribe to the Event only if we have an eventId
  const { data: eventData } = useSubscription(listenToEvent, {
    variables: {
      event_id: eventId,
    },
    skip: !eventId,
  })

  const { data: chatMessages } = useSubscription(listenToEventChatMessages, {
    variables: {
      event_id: eventId,
    },
    skip: !eventId,
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
        })
      }
    }
  }, [chatMessages, userOnLobbyOrGroupChat])

  return <EventContext.Provider value={[state, dispatch]}>{children}</EventContext.Provider>
}

export { EventProvider, EventContext }
