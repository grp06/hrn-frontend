import React from 'react'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/styles'
import { getTimeUntilEvent } from '../../utils'
import { SetupMicAndCameraButton, StartPreEventButton } from '../Event'
import { StartEventButton } from '../PreEvent'
import { PreEventInstructionModal } from '.'

const useStyles = makeStyles((theme) => ({
  boxContainer: {
    width: '100%',
    height: '10vh',
    position: 'absolute',
    top: 'auto',
    bottom: '0%',
  },
}))

const BottomControlPanel = React.memo(({ permissions, event, userId }) => {
  const classes = useStyles()
  const { start_at: eventStartTime, id: eventId, host_id, status: eventStatus } = event
  const timeUntilEvent = getTimeUntilEvent(eventStartTime)
  const userIsHost = host_id === userId
  const micOrCameraIsDisabled = Object.values(permissions).indexOf(false) > -1
  console.log('bottom control panel render')

  return (
    <Grid
      container
      direction="row"
      justify="flex-start"
      alignItems="center"
      wrap="nowrap"
      className={classes.boxContainer}
    >
      {userIsHost && eventStatus === 'not-started' && (
        <Grid container direction="column">
          <Grid container direction="row" alignItems="center">
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
          <Grid container direction="row" alignItems="center">
            <StartEventButton event={event} userId={userId} />
          </Grid>
        </Grid>
      )}
      <Grid>
        <SetupMicAndCameraButton permissions={permissions} />
      </Grid>
    </Grid>
  )
})

export default BottomControlPanel
