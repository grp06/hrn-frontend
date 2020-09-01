import React from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/styles'
import { getTimeUntilEvent } from '../../utils'
import { SetupMicAndCameraButton, StartPreEventButton } from '../Event'
import { StartEventButton } from '../PreEvent'
import { PreEventInstructionModal } from '.'
import { TransitionModal } from '../../common'
import { startEvent } from '../../helpers'

const useStyles = makeStyles((theme) => ({
  boxContainer: {
    width: '100%',
    height: '10vh',
    padding: theme.spacing(1.5),
  },
}))

const BottomControlPanel = ({ permissions, event, user }) => {
  const classes = useStyles()
  const { start_at: eventStartTime, id: eventId, host_id, status: eventStatus } = event
  const { id: userId } = user
  const timeUntilEvent = getTimeUntilEvent(eventStartTime)
  const userIsHost = host_id === userId
  const micOrCameraIsDisabled = Object.values(permissions).indexOf(false) > -1

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
      direction="row"
      justify="space-between"
      alignItems="center"
      wrap="nowrap"
      className={classes.boxContainer}
    >
      <Grid container direction="column">
        <Typography variant="subtitle1">Frist Check Your Tech:</Typography>
        <SetupMicAndCameraButton permissions={permissions} />
      </Grid>
      {userIsHost && eventStatus === 'not-started' && (
        <Grid container direction="column">
          <Typography variant="subtitle1">Ready?</Typography>
          <Grid container direction="row" alignItems="center">
            <StartPreEventButton
              disabled={micOrCameraIsDisabled}
              eventId={eventId}
              timeUntilEvent={timeUntilEvent}
            />
            <PreEventInstructionModal />
            {renderResetEvent}
          </Grid>
        </Grid>
      )}
      {userIsHost && eventStatus === 'pre-event' && (
        <Grid container direction="column">
          <Typography variant="subtitle1">Ready?</Typography>
          <Grid container direction="row" alignItems="center">
            <StartEventButton event={event} user={user} />
          </Grid>
        </Grid>
      )}
    </Grid>
  )
}

export default BottomControlPanel
