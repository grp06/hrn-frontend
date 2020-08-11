import React from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/styles'

import { StartEventButton } from '.'
import { TransitionModal } from '../../common'
import { startEvent } from '../../helpers'
import { useAppContext } from '../../context/useAppContext'

const useStyles = makeStyles((theme) => ({
  container: {
    position: 'absolute',
    top: '2%',
    right: 'auto',
    bottom: 'auto',
    left: '0%',
    width: '250px',
    height: 'auto',
    borderRadius: '4px',
    border: '2px solid #3e4042',
    boxShadow: '5px 5px 0 #3e4042',
    backgroundColor: theme.palette.common.greyCard,
    padding: theme.spacing(1),
  },
  onlineUsersText: {
    color: theme.palette.common.sunray,
    textAlign: 'center',
    marginBottom: theme.spacing(1),
  },
}))

const EventControlsCard = () => {
  const classes = useStyles()
  const { user, event, app } = useAppContext()
  const { appLoading } = app
  const { userId } = user
  const { host_id, id: eventId, event_users, status: eventStatus } = event
  const regex = /\/events\/\d+/
  const eventIdInUrl = Boolean(window.location.pathname.match(regex))
  const isEventHost = host_id === userId

  const numberOfOnlineUsers = () => {
    return (
      event_users.length && (
        <Typography variant="subtitle1" className={classes.onlineUsersText}>
          Online Users: {event_users.length}
        </Typography>
      )
    )
  }

  const renderStartEvent = () => {
    return eventStatus === 'pre-event' && <StartEventButton event={event} user={user} />
  }

  const renderResetEvent = TransitionModal({
    button: {
      buttonText: 'Reset Event',
      buttonVariant: 'text',
      buttonColor: 'link',
    },
    modalBody: (
      <Typography variant="h5">
        This will reset the event in its entirety. Are you 100% sure?
      </Typography>
    ),
    onAcceptFunction: async () => {
      window.analytics &&
        window.analytics.track('Event reset', {
          eventId,
          hostId: host_id,
        })
      await startEvent({ eventId, num_rounds: null, round_length: null, reset: true })
    },
  })

  return (
    <>
      {isEventHost && eventIdInUrl && eventStatus !== 'not-started' && !appLoading && (
        <Grid
          container
          direction="column"
          justify="stretch"
          alignItems="center"
          className={classes.container}
        >
          {numberOfOnlineUsers()}
          {renderStartEvent()}
          {renderResetEvent}
        </Grid>
      )}
    </>
  )
}

export default EventControlsCard
