import React, { useEffect } from 'react'

import { useQuery, useMutation, useSubscription } from '@apollo/react-hooks'
import { useImmer } from 'use-immer'

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

  const { data: eventData, loading: eventDataLoading, error: eventDataError } = useSubscription(
    listenToEvent,
    {
      variables: {
        event_id: event_id,
      },
      skip: !state.eventId && !state.eventsData,
    }
  )

  useEffect(() => {
    if (eventData && eventData.events.length) {
      return dispatch((draft) => {
        draft.event = eventData.events[0]
      })
    }
    // if theres no data that means we are probably on an event that
    // doesn't exist. Push user back to /events
    return history.push('/events')
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

  // Setting the user state in provider after findUserById Query is made
  useEffect(() => {
    if (userData && userData.users.length) {
      const { name, role, id } = userData.users[0]
      dispatch((draft) => {
        draft.role = role
        draft.userId = id
        draft.name = name
      })
    }
  }, [userData])

  // when user comes to page see if they have id in local storage
  // if not redirect back to login page
  useEffect(() => {
    if (!userId) {
      const myUserId = localStorage.getItem('userId')
      if (!myUserId && state.redirect === null) {
        return dispatch((draft) => {
          draft.redirect = true
          draft.appLoading = false
        })
      }
      dispatch((draft) => {
        draft.userId = myUserId
        draft.appLoading = false
      })
    }
  }, [])

  return <AppContext.Provider value={[state, dispatch]}>{children}</AppContext.Provider>
}

export { AppProvider, AppContext }
