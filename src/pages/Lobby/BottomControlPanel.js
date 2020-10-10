import React from 'react'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/styles'
import Typography from '@material-ui/core/Typography'
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
    position: 'absolute',
    top: 'auto',
    bottom: '0.5%',
  },
}))

const BottomControlPanel = ({ permissions, event, userId }) => {
  const classes = useStyles()
  const { start_at: eventStartTime, id: eventId, host_id, status: eventStatus } = event
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
      justify="flex-start"
      alignItems="flex-end"
      wrap="nowrap"
      className={classes.boxContainer}
    >
      {userIsHost && eventStatus === 'not-started' && (
        <Grid container direction="column">
          <Grid container direction="row" alignItems="flex-end">
            <StartPreEventButton
              disabled={micOrCameraIsDisabled}
              eventId={eventId}
              timeUntilEvent={timeUntilEvent}
            />
            <PreEventInstructionModal />
          </Grid>
        </Grid>
      )}
      {userIsHost && eventStatus === 'pre-event' && (
        <Grid container direction="column">
          <Grid container direction="row" alignItems="flex-end">
            <StartEventButton event={event} userId={userId} />
          </Grid>
        </Grid>
      )}
      {userIsHost && (eventStatus === 'in-between-rounds' || eventStatus === 'room-in-progress') && (
        <Grid container direction="column">
          <Grid container direction="row" alignItems="flex-end">
            {renderResetEvent}
          </Grid>
        </Grid>
      )}
      <Grid>
        <SetupMicAndCameraButton permissions={permissions} />
      </Grid>
    </Grid>
  )
}

export default BottomControlPanel