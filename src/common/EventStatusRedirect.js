import React from 'react'
import { Redirect } from 'react-router-dom'

const EventStatusRedirect = ({
  isEventParticipant,
  event,
  micOrCameraIsDisabled,
  eventSet,
  userId,
}) => {
  if (eventSet && userId && isEventParticipant && !micOrCameraIsDisabled) {
    switch (event.status) {
      case 'pre-event':
        return <Redirect to={`/events/${event.id}/pre-event`} />
      case 'partner-preview':
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
