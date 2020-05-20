import React, { useEffect } from 'react'

import { useQuery } from '@apollo/react-hooks'
import { Redirect } from 'react-router-dom'

import { EventCard, Loading } from '../common'
import { useGameContext } from '../context/useGameContext'
import { getEvents } from '../gql/queries'

const Events = () => {
  const { appLoading } = useGameContext()

  const { data: eventsData, loading: eventsLoading, error: eventsError } = useQuery(getEvents)

  if (appLoading || eventsLoading) {
    return <Loading />
  }

  if (!eventsData) {
    return <div>no events data </div>
  }

  if (eventsData.events.length) {
    const { id } = eventsData.events[0]
    console.log('redirect')
    return <Redirect to={`/event/${id}`} push />
  }

  return (
    <div>
      {eventsData.events.map(({ description, event_name, id, host_id }) => {
        return <EventCard key={id} name={event_name} desc={description} id={id} hostId={host_id} />
      })}
    </div>
  )
}

export default Events
