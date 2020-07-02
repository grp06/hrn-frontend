import React, { useEffect } from 'react'

import { useQuery, useMutation, useSubscription } from '@apollo/react-hooks'
import { useImmer } from 'use-immer'
import { useHistory } from 'react-router-dom'

import { findUserById } from '../gql/queries'
import { updateLastSeen } from '../gql/mutations'
import { constants } from '../utils'
import { listenToEvent } from '../gql/subscriptions'

const { lastSeenDuration } = constants

const AppContext = React.createContext()

const defaultState = {
  user: {
    name: '',
    userId: null,
    role: '',
    email: '',
  },
  app: {
    redirect: null,
    appLoading: true,
  },
  event: {},
  twilio: {
    partnerDisconnected: false,
    lateArrival: false,
  },
}

const AppProvider = ({ children }) => {
  const [state, dispatch] = useImmer({ ...defaultState })
  const { event } = state
  const regex = /\/events\/\d+/
  const eventIdInUrl = Boolean(window.location.pathname.match(regex))
  // if we are on a route that has '/events/id' in it, then we can peel off the id
  // and use it to make our subscription to the event
  const pathnameArray = eventIdInUrl ? window.location.pathname.split('/') : null
  const eventId = pathnameArray ? parseInt(pathnameArray[2], 10) : null
  const history = useHistory()
  const { userId } = state.user

  const { data: userData } = useQuery(findUserById, {
    variables: { id: userId },
    skip: !userId,
  })

  // listen to the Event only if we have an eventId from match
  // this means we have to be on a route with an id
  const { data: eventData } = useSubscription(listenToEvent, {
    variables: {
      event_id: eventId,
    },
    skip: !eventId,
  })

  useEffect(() => {
    // if on event page and its a valid event
    if (eventIdInUrl && eventData) {
      // event doesn't exist - redirect user
      if (!eventData.events.length) {
        dispatch((draft) => {
          draft.app.appLoading = false
        })
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
        return dispatch((draft) => {
          draft.event = eventData.events[0]
          draft.app.appLoading = false
        })
      }
    }
  }, [eventData, dispatch, event, eventIdInUrl, history])

  // update last_seen on the user object every X seconds so users show up as "online" for host
  useEffect(() => {
    if (userId) {
      const interval = setInterval(async () => {
        try {
          await fetch(`${process.env.REACT_APP_API_URL}/api/auth/update-last-seen`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify({ userId }),
          })
        } catch (error) {
          // sometimes theres an error here. Reloading "fixes" it  :|
          window.location.reload()
        }
      }, lastSeenDuration)
      return () => {
        clearInterval(interval)
      }
    }
  }, [userId])

  // Setting the user state in context after findUserById Query is made
  useEffect(() => {
    if (userData) {
      if (userData.users.length) {
        const { name, role, id, email } = userData.users[0]
        return dispatch((draft) => {
          draft.user.role = role
          draft.user.userId = id
          draft.user.name = name
          draft.user.email = email

          if (!eventIdInUrl) {
            draft.app.appLoading = false
          }
        })
      }
      localStorage.clear()
      return history.push('/')
    }
  }, [userData, userId])

  // when user comes to page see if they have id in local storage
  // if not redirect back to login page
  useEffect(() => {
    if (!userId) {
      const localStorageUserId = localStorage.getItem('userId')
      if (!localStorageUserId) {
        dispatch((draft) => {
          draft.app.appLoading = false
        })
      }
      return dispatch((draft) => {
        draft.user.userId = parseInt(localStorageUserId, 10)
      })
    }
  }, [userId])

  return <AppContext.Provider value={[state, dispatch]}>{children}</AppContext.Provider>
}

export { AppProvider, AppContext }
