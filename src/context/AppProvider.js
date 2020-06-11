import React, { useEffect } from 'react'

import { useQuery, useMutation, useSubscription } from '@apollo/react-hooks'
import { useImmer } from 'use-immer'
import { useHistory, Redirect } from 'react-router-dom'

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
  },
  app: {
    redirect: null,
    appLoading: true,
  },
  event: null,
}
const AppProvider = ({ children }) => {
  const [state, dispatch] = useImmer({ ...defaultState })
  const shouldFetchEvent = window.location.pathname.indexOf('/events/') > -1
  // if we are on a route that has '/events' in it, then we can peel off the id
  // and use it to make our subscription to the event
  const pathnameArray = shouldFetchEvent ? window.location.pathname.split('/') : null
  const eventId = pathnameArray ? pathnameArray[2] : null
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
    if (shouldFetchEvent) {
      if (eventData && eventData.events.length) {
        return dispatch((draft) => {
          draft.event = eventData.events[0]
          draft.app.appLoading = false
        })
      }
    }

    // if theres no data that means we are probably on an event that
    // doesn't exist. Push user back to /events
    // / - George: It could also be that the person just has 0 events
    // return history.push('/events')
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
        if (!shouldFetchEvent) {
          draft.app.appLoading = false
        }
      })
    }
  }, [userData])

  // when user comes to page see if they have id in local storage
  // if not redirect back to login page
  useEffect(() => {
    if (!userId) {
      const myUserId = localStorage.getItem('userId')
      if (!myUserId) {
        dispatch((draft) => {
          draft.app.appLoading = false
        })
        history.push('/')
      }
      return dispatch((draft) => {
        draft.user.userId = myUserId
      })
    }
  }, [])

  return <AppContext.Provider value={[state, dispatch]}>{children}</AppContext.Provider>
}

export { AppProvider, AppContext }
