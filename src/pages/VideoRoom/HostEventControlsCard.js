import React from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/styles'

import { TransitionModal } from '../../common'
import { startEvent } from '../../helpers'
import { useGetOnlineEventAttendees } from '../../hooks'

const useStyles = makeStyles((theme) => ({
  container: {
    width: '250px',
    height: 'auto',
    borderRadius: '4px',
    border: '2px solid #3e4042',
    boxShadow: '5px 5px 0 #3e4042',
    backgroundColor: theme.palette.common.greyCard,
    padding: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
  onlineUsersText: {
    color: theme.palette.common.sunray,
    textAlign: 'center',
    marginBottom: theme.spacing(1),
  },
}))

const HostEventControlsCard = ({ event, userId }) => {
  const classes = useStyles()
  const { host_id, id: eventId } = event
  const isEventHost = host_id === userId
  const onlineEventAttendees = useGetOnlineEventAttendees(event, isEventHost)

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
    <Grid
      container
      direction="column"
      justify="space-evenly"
      alignItems="center"
      className={classes.container}
    >
      <Typography variant="subtitle1" className={classes.onlineUsersText}>
        Online Users: {onlineEventAttendees ? onlineEventAttendees.length : ' --'}
      </Typography>
      {renderResetEvent}
    </Grid>
  )
}

export default HostEventControlsCard
