import React from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/styles'

import { SetupMicAndCameraButton, StartPreEventButton } from '../Event'
import { PreEventInstructionModal } from '.'

const useStyles = makeStyles((theme) => ({
  boxContainer: {
    width: '100%',
    height: '10vh',
    padding: theme.spacing(1.5),
  },
}))

const BottomControlPanel = ({ eventId, permissions, timeUntilEvent, userIsHost }) => {
  const classes = useStyles()
  const micOrCameraIsDisabled = Object.values(permissions).indexOf(false) > -1
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
        <Typography variant="subtitle1">Check Your Tech:</Typography>
        <SetupMicAndCameraButton permissions={permissions} />
      </Grid>
      {userIsHost && (
        <Grid container direction="column">
          <Typography variant="subtitle1">Ready?</Typography>
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
    </Grid>
  )
}

export default BottomControlPanel
