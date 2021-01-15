import React, { useEffect, createContext, useContext } from 'react'

import { useSubscription } from '@apollo/react-hooks'
import { useImmer } from 'use-immer'
import { useHistory } from 'react-router-dom'
import { useAppContext } from '.'
import { listenToEventNew } from '../gql/subscriptions'

const EventNewContext = createContext()

// types of status for event-new include
// 1) not-started
// 2) call-in-progress
// 3) paused
// 4) completed
const defaultState = {
  // eventNewId is for eventNew subscriptions
  eventNewId: null,
  eventNew: {},
}

const useEventNewContext = () => {
  const [state, dispatch] = useContext(EventNewContext)

  if (dispatch === undefined) {
    throw new Error('Must have dispatch defined')
  }

  const resetEventNew = () => {
    dispatch((draft) => {
      draft.eventNew = {}
    })
  }

  const setEventNewId = (eventNewId) => {
    dispatch((draft) => {
      draft.eventNewId = eventNewId
    })
  }

  return {
    ...state,
    resetEventNew,
    setEventNewId,
  }
}

const EventNewProvider = ({ children }) => {
  const [state, dispatch] = useImmer({ ...defaultState })
  const { setAppLoading } = useAppContext()
  const { pathname } = window.location
  const { eventNew, eventNewId } = state
  const eventNewRegex = /\/events-new\/\d+/
  const history = useHistory()
  const userOnEventNewPage = Boolean(pathname.match(eventNewRegex))
  const userOnLobbyOrGroupChat = pathname.includes('lobby')

  // subscribe to the Event only if we have an eventNewId
  const { data: eventNewData } = useSubscription(listenToEventNew, {
    variables: {
      event_id: eventNewId,
    },
    skip: !eventNewId,
  })

  useEffect(() => {
    // if on eventNew page and its a valid eventNew
    if (userOnEventNewPage && eventNewData) {
      // eventNew doesn't exist - redirect user
      if (!eventNewData.events_new.length) {
        setAppLoading(false)
        return history.push('/events-new')
      }
      // cases to set eventNew data:
      // 1) no eventNew data set yet
      // 2) incoming data from subscription is different from existing
      const existingData = JSON.stringify(eventNew)
      const incomingData = JSON.stringify(eventNewData.events_new[0])

      if (existingData !== incomingData) {
        const eventWasReset =
          eventNew.status &&
          eventNew.status !== 'not-started' &&
          eventNewData.events_new[0].status === 'not-started'
        if (eventWasReset) {
          window.location.reload()
        }
        dispatch((draft) => {
          draft.eventNew = eventNewData.events_new[0]
        })
        return setAppLoading(false)
      }
    }
  }, [eventNewData, dispatch, eventNew, userOnEventNewPage, history])

  return <EventNewContext.Provider value={[state, dispatch]}>{children}</EventNewContext.Provider>
}

export { useEventNewContext, EventNewProvider }
