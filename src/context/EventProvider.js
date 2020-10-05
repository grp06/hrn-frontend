import React, { useEffect } from 'react'

import { useSubscription } from '@apollo/react-hooks'
import { useImmer } from 'use-immer'
import { useHistory } from 'react-router-dom'
import { useAppContext } from '.'
import { listenToEvent } from '../gql/subscriptions'

const EventContext = React.createContext()

const defaultState = {
  permissions: {
    hasWebCam: false,
    hasMicrophone: false,
    isWebcamAlreadyCaptured: false,
    isMicrophoneAlreadyCaptured: false,
  },
  // eventId is for event subscriptions
  eventId: null,
  event: {},
}

const EventProvider = ({ children }) => {
  const [state, dispatch] = useImmer({ ...defaultState })
  const { setAppLoading } = useAppContext()
  const { event } = state
  const eventRegex = /\/events\/\d+/
  const history = useHistory()
  const userOnEventPage = Boolean(window.location.pathname.match(eventRegex))
  const pathnameArray = window.location.pathname.split('/')
  const eventId = parseInt(pathnameArray[2], 10)

  // subscribe to the Event only if we have an eventId
  const { data: eventData } = useSubscription(listenToEvent, {
    variables: {
      event_id: eventId,
    },
    skip: !eventId,
  })

  useEffect(() => {
    // if on event page and its a valid event
    if (userOnEventPage && eventData) {
      // event doesn't exist - redirect user
      if (!eventData.events.length) {
        setAppLoading(false)
        return history.push('/events')
      }
      // cases to set event data
      // no event data set yet
      // incoming data from subscription is different from existing
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

  return <EventContext.Provider value={[state, dispatch]}>{children}</EventContext.Provider>
}

export { EventProvider, EventContext }
