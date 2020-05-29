import React, { useState } from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { makeStyles } from '@material-ui/styles'
import Card from '@material-ui/core/Card'
import { EventForm } from '../common'
import { getEventUsers } from '../gql/queries'
import { insertEventUser, deleteEventUser } from '../gql/mutations'
import { useGameContext } from '../context/useGameContext'

const useStyles = makeStyles((theme) => ({
  cardContainer: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: 600,
    margin: '0 auto',
  },
  margin: {
    margin: '25px 0',
  },
}))

const PreEvent = ({ eventData }) => {
  const classes = useStyles()

  const { description, event_name, start_at } = eventData.events[0]
  const { userId, role } = useGameContext()

  const [showEventForm, setShowEventForm] = useState()
  const { data, loading, error, refetch } = useQuery(getEventUsers, {
    variables: {
      eventId: eventData.events[0].id,
    },
  })

  const [insertEventUserMutation] = useMutation(insertEventUser, {
    variables: {
      eventId: eventData.events[0].id,
      userId,
    },
    skip: role === 'host',
  })
  const [deleteEventUserMutation] = useMutation(deleteEventUser, {
    variables: {
      eventId: eventData.events[0].id,
      userId,
    },
    skip: role === 'host',
  })

  if (loading) {
    return <div className={classes.margin}>loading stuff</div>
  }
  const attendees = data.event_users
  const alreadyAttending = attendees.find((attendee) => attendee.user.id === userId)
  return (
    <div className={classes.cardContainer}>
      <div className={classes.margin}>
        description:
        {description}
      </div>
      <div className={classes.margin}>
        event name:
        {event_name}
      </div>
      <div className={classes.margin}>
        starts at:
        {start_at}
      </div>

      <button type="button" onClick={() => setShowEventForm(!showEventForm)}>
        {showEventForm ? 'close edit event' : 'edit event'}
      </button>
      {data.event_users.length > 0 ? <b>list of event users</b> : <b>No attendees yet</b>}
      {data.event_users.map((user) => {
        return <div className={classes.margin}>{user.user.name}</div>
      })}
      <div style={{ display: showEventForm ? 'block' : 'none' }}>
        <EventForm eventData={eventData} />
      </div>
      <div>
        <button
          type="button"
          onClick={async () => {
            if (alreadyAttending) {
              await deleteEventUserMutation()
              refetch()
            } else {
              await insertEventUserMutation()
              refetch()
            }
          }}
        >
          {alreadyAttending ? 'Cancel RSVP' : 'Join Event'}
        </button>
      </div>
    </div>
  )
}

export default PreEvent
