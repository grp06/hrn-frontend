import React, { useEffect } from 'react'

import { useSubscription } from '@apollo/react-hooks'
import { useImmer } from 'use-immer'
import { useHistory } from 'react-router-dom'
import { listenToEvent } from '../gql/subscriptions'

const EventContext = React.createContext()

const defaultState = {
  event: null,
}

const EventProvider = (props) => {
  debugger
  const [state, dispatch] = useImmer({ ...defaultState })
  const { id: event_id } = match.params
  const history = useHistory()

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

  return <EventContext.Provider value={[state, dispatch]}>{children}</EventContext.Provider>
}

export { EventProvider, EventContext }
