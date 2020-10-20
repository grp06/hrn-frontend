import React from 'react'
import moment from 'moment'
import FeatherIcon from 'feather-icons-react'
import ICalendarLink from 'react-icalendar-link'

const CalendarIconIcs = (props) => {
  const { event } = props
  const { id, start_at, event_name, description } = event

  const startFormatted = moment.utc(start_at).format('YYYY-MM-DDTHH:mm:ssZ')

  const endFormatted = moment.utc(start_at).clone().add(1, 'hour').format('YYYY-MM-DDTHH:mm:ssZ')

  const eventShort = {
    title: event_name,
    startTime: startFormatted,
    endTime: endFormatted,
    description: description,
    location: `https://launch.hirightnow.co/events/${id}`,
  }

  return (
    <ICalendarLink event={eventShort}>
      <FeatherIcon icon="calendar" stroke="#e98dd7" size="24" />
    </ICalendarLink>
  )
}

export default CalendarIconIcs
