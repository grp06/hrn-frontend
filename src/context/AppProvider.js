import React, { useEffect } from 'react'

import { useQuery, useMutation, useSubscription } from '@apollo/react-hooks'
import { useImmer } from 'use-immer'
import { useHistory, Redirect } from 'react-router-dom'

import { findUserById } from '../gql/queries'
import { updateLastSeen } from '../gql/mutations'
import { constants } from '../utils'
import { listenToEvent } from '../gql/subscriptions'
import { useAppContext } from './useAppContext'

const { lastSeenDuration } = constants

const AppContext = React.createContext()

const defaultState = {
  user: {
    name: '',
    userId: null,
    role: '',
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
  const eventIdInUrl = window.location.pathname.indexOf('/events/') > -1
  // if we are on a route that has '/events/id' in it, then we can peel off the id
  // and use it to make our subscription to the event
  const pathnameArray = eventIdInUrl ? window.location.pathname.split('/') : null
  const eventId = pathnameArray ? parseInt(pathnameArray[2], 10) : null
  const history = useHistory()
  const { userId } = state.user

  const { data: userData, loading: userDataLoading, error: userDataError } = useQuery(
    findUserById,
    {
      variables: { id: userId },
      skip: !userId,
    }
  )

  const [updateLastSeenMutation] = useMutation(updateLastSeen, {
    variables: {
      now: new Date().toISOString(),
      id: userId,
    },
    skip: !userId,
  })

  // listen to the Event only if we have an eventId from match
  // this means we have to be on a route with an id
  const { data: eventData, loading: eventDataLoading, error: eventDataError } = useSubscription(
    listenToEvent,
    {
      variables: {
        event_id: eventId,
      },
      skip: !eventId,
    }
  )

  useEffect(() => {
    if (eventIdInUrl && eventData) {
      // event doesn't exist - redirect user
      if (!eventData.events.length) {
        dispatch((draft) => {
          draft.app.appLoading = false
        })
        return history.push('/events')
      }

      // cases to set event data
      // no event data
      // new event data is different from existing
      const existingData = JSON.stringify(event)
      const incomingData = JSON.stringify(eventData.events[0])

      if (existingData !== incomingData) {
        return dispatch((draft) => {
          draft.event = eventData.events[0]
          draft.app.appLoading = false
        })
      }
    }
  }, [eventData])

  // Setting lastSeen Mutation
  useEffect(() => {
    if (userId) {
      const interval = setInterval(async () => {
        try {
          await updateLastSeenMutation()
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
    if (userData && userData.users.length) {
      const { name, role, id } = userData.users[0]
      return dispatch((draft) => {
        draft.user.role = role
        draft.user.userId = id
        draft.user.name = name
        if (!eventIdInUrl) {
          draft.app.appLoading = false
        }
      })
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
