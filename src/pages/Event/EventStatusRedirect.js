import React from 'react'
import { Redirect } from 'react-router-dom'

const EventStatusRedirect = ({ isEventParticipant, event, eventSet, userId }) => {
  const { start_at } = event
  const now = Date.now()
  const startTime = new Date(start_at).getTime()
  const diff = startTime - now

  if (eventSet && userId && isEventParticipant) {
    // push user to lobby if time is less than 15 mins.
    if (diff < 900000 && event.status === 'not-started') {
      return <Redirect to={`/events/${event.id}/lobby`} />
    }
    switch (event.status) {
      case 'pre-event':
        return <Redirect to={`/events/${event.id}/lobby`} />
      case 'in-between-rounds':
        return <Redirect to={`/events/${event.id}/video-room`} />
      case 'room-in-progress':
        return <Redirect to={`/events/${event.id}/video-room`} />
      case 'group-video-chat':
        return <Redirect to={`/events/${event.id}/group-video-chat`} />
      case 'complete':
        return <Redirect to={`/events/${event.id}/event-complete`} />
      default:
        return null
    }
  }
  return null
}

export default EventStatusRedirect
