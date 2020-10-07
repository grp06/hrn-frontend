import React from 'react'
import { Redirect } from 'react-router-dom'

const EventStatusRedirect = ({
  isEventParticipant,
  event,
  micOrCameraIsDisabled,
  eventSet,
  userId,
}) => {
  const { start_at } = event
  const now = Date.now()
  const startTime = new Date(start_at).getTime()
  const diff = startTime - now

  if (eventSet && userId && isEventParticipant && !micOrCameraIsDisabled) {
    // push user to lobby if time is less than 15 mins.
    if (diff < 900000) {
      return <Redirect to={`/events/${event.id}/lobby`} />
    }
    switch (event.status) {
      case 'pre-event':
        return <Redirect to={`/events/${event.id}/lobby`} />
      case 'in-between-rounds':
        return <Redirect to={`/events/${event.id}/video-room`} />
      case 'room-in-progress':
        return <Redirect to={`/events/${event.id}/video-room`} />
      case 'complete':
        return <Redirect to={`/events/${event.id}/event-complete`} />
      default:
        return null
    }
  }
  return null
}

export default EventStatusRedirect
