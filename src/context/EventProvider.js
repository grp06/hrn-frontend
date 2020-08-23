import React, { useEffect } from 'react'

import { useQuery, useSubscription, useMutation } from '@apollo/react-hooks'
import { useImmer } from 'use-immer'
import { useUserContext } from '.'
import { useHistory } from 'react-router-dom'

import { findUserById } from '../gql/queries'
import { updateLastSeen } from '../gql/mutations'

import { constants } from '../utils'
import { listenToEvent } from '../gql/subscriptions'

const { lastSeenDuration } = constants

const EventContext = React.createContext()

const defaultState = {
  app: {
    redirect: null,
    appLoading: true,
    permissions: {
      hasWebCam: false,
      hasMicrophone: false,
      isWebcamAlreadyCaptured: false,
      isMicrophoneAlreadyCaptured: false,
    },
  },
  // eventId is for event subscriptions
  eventId: null,
  event: {},
  twilio: {
    partnerDisconnected: false,
    hasPartnerAndIsConnecting: false,
  },
}

const EventProvider = ({ children }) => {
  const [state, dispatch] = useImmer({ ...defaultState })
  const { user } = useUserContext()
  const { userId } = user
  const { event, app } = state
  const { permissions } = app
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

  const [updateLastSeenMutation] = useMutation(updateLastSeen, {
    variables: {
      now: new Date().toISOString(),
      id: userId,
    },
    skip: !userId,
  })

  useEffect(() => {
    // if on event page and its a valid event
    if (userOnEventPage && eventData) {
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
  }, [eventData, dispatch, event, userOnEventPage, history])

  // update last_seen on the user object every X seconds so users show up as "online" for host
  useEffect(() => {
    if (userId && permissions.isWebcamAlreadyCaptured && permissions.isMicrophoneAlreadyCaptured) {
      const interval = setInterval(async () => {
        console.log('last seen')
        try {
          const lastSeenUpdated = await updateLastSeenMutation()

          dispatch((draft) => {
            draft.user.updatedAt = lastSeenUpdated.data.update_users.returning[0].updated_at
          })
        } catch (error) {
          console.log('interval -> error', error)
          // sometimes theres an error here. Reloading "fixes" it  :|
          // window.location.reload()
        }
      }, lastSeenDuration)
      return () => {
        clearInterval(interval)
      }
    }
  }, [userId, permissions])

  return <EventContext.Provider value={[state, dispatch]}>{children}</EventContext.Provider>
}

export { EventProvider, EventContext }
