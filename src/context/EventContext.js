import React, { useEffect, createContext, useContext } from 'react'

import { useSubscription } from '@apollo/react-hooks'
import { useImmer } from 'use-immer'
import { useHistory } from 'react-router-dom'
import { useUserContext } from '.'
import { listenToEvent, listenToEventChatMessages } from '../gql/subscriptions'

const EventContext = createContext()

const defaultState = {
  // eventId is for event subscriptions
  eventId: null,
  event: {},
  eventChatMessages: [],
  numberOfReadChatMessages: 0,
  numberOfUnreadChatMessages: 0,
  eventContextLoading: true,
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
  const [state, dispatch] = useImmer({ ...defaultState })
  const { user, userContextLoading } = useUserContext()
  const { id: userId } = user
  const { pathname } = window.location

  const { event, eventChatMessages, numberOfReadChatMessages, eventId, eventContextLoading } = state
  const eventRegex = /\/events\/\d+/
  const history = useHistory()
  const userOnEventPage = Boolean(pathname.match(eventRegex))
  const userOnLobbyOrGroupChat = pathname.includes('lobby') || pathname.includes('group-video-chat')
  const pathnameArray = pathname.split('/')

  const eventIdFromUrl = parseInt(pathnameArray[2], 10)

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
    skip: !eventId || !userId,
  })

  useEffect(() => {
    if (!userOnEventPage && eventId) {
      dispatch((draft) => {
        draft.eventId = null
        draft.event = {}
        draft.eventChatMessages = []
        draft.numberOfReadChatMessages = 0
        draft.numberOfUnreadChatMessages = 0
        draft.eventContextLoading = true
      })
    }
  }, [userOnEventPage, eventId])

  // useEffect(() => {
  //   // TODO we might want to wait for chatMessages to load here... but we dont have them for anonymous users
  //   if (!userContextLoading && eventData && eventContextLoading) {
  //     console.log('🚀 ~ useEffect ~ eventData', eventData)
  //     console.log('🚀 ~ useEffect ~ eventContextLoading setting to false', eventContextLoading)
  //     dispatch((draft) => {
  //       draft.eventContextLoading = false
  //     })
  //   }
  // }, [userContextLoading, eventData, eventContextLoading])

  useEffect(() => {
    if (!eventId && eventIdFromUrl) {
      dispatch((draft) => {
        draft.eventId = parseInt(eventIdFromUrl, 10)
      })
    }
  }, [eventIdFromUrl])

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
        dispatch((draft) => {
          console.log('🚀 ~ useEffect ~ eventContextLoading setting to false', eventContextLoading)
          draft.eventContextLoading = false
        })
        return history.push('/events')
      }
      const eventObjectFromSub = eventData?.events[0]
      // cases to set event data:
      // 1) no event data set yet
      // 2) incoming data from subscription is different from existing
      const existingData = JSON.stringify(event)
      const incomingData = JSON.stringify(eventObjectFromSub)

      if (existingData !== incomingData) {
        const eventWasReset =
          event.status &&
          event.status !== 'not-started' &&
          eventObjectFromSub.status === 'not-started'
        if (eventWasReset) {
          window.location.reload()
        }
        console.log('set event data from sub')
        dispatch((draft) => {
          draft.event = eventObjectFromSub
          draft.eventContextLoading = false
        })
        console.log('didnt set eventContextLoading false because data didnt change')
      }
    }
  }, [eventData, dispatch, event, userOnEventPage, history])

  // whenever we get new messages, update the messages array and calculate the number of unread messages
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
  }, [chatMessages, userOnLobbyOrGroupChat, dispatch, eventChatMessages, numberOfReadChatMessages])

  // whenever we update the number of read messages (when we close the chat), then set the number of unread messages
  useEffect(() => {
    if (numberOfReadChatMessages && chatMessages) {
      dispatch((draft) => {
        draft.numberOfUnreadChatMessages =
          chatMessages.event_group_chat_messages.length - numberOfReadChatMessages
      })
    }
  }, [numberOfReadChatMessages, chatMessages, dispatch])

  return <EventContext.Provider value={[state, dispatch]}>{children}</EventContext.Provider>
}

export { useEventContext, EventProvider }
