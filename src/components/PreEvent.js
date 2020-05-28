import React, { useState } from 'react'
import { useSubscription, useQuery } from '@apollo/react-hooks'
import { EventForm } from '../common'
import { getEventParticipants } from '../gql/queries'

const PreEvent = ({ eventData, match }) => {
  const { description, event_name, start_at } = eventData.events[0]

  console.log('PreEvent -> eventData.events[0].id', eventData.events[0].id)
  const [showEventForm, setShowEventForm] = useState()
  const { data, loading, error } = useQuery(getEventParticipants, {
    variables: {
      eventId: eventData.events[0].id,
    },
  })
  if (loading) {
    return <div>loading stuff</div>
  }

  return (
    <div>
      <div>{description}</div>
      <div>{event_name}</div>
      <div>{start_at}</div>
      <button type="button" onClick={() => setShowEventForm(!showEventForm)}>
        {showEventForm ? 'close edit event' : 'edit event'}
      </button>
      {data.event_users.length > 0 && (
        <div>
          <b>list of event users</b>
        </div>
      )}
      {data.event_users.map((user) => {
        console.log('user ', user)
        return <div>{user.user.name}</div>
      })}
      <div style={{ display: showEventForm ? 'block' : 'none' }}>
        <EventForm eventData={eventData} />
      </div>
    </div>
  )
}

export default PreEvent
