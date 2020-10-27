import React from 'react'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/styles'

import { SetupMicAndCameraButton } from '../Event'

const useStyles = makeStyles((theme) => ({
  container: {
    position: 'fixed',
    zIndex: 999,
    width: '100%',
    height: '80px',
    top: 'auto',
    bottom: '0%',
    padding: theme.spacing(2, 4),
    backgroundColor: theme.palette.common.grey10,
  },
  settingsAndChatGrid: {
    paddingRight: '6vw',
  },
}))

const GroupVideoChatBottomPanel = ({ event, setUserHasEnabledCameraAndMic, userId }) => {
  const classes = useStyles()
  const { start_at: eventStartTime, id: eventId, host_id, status: eventStatus } = event
  const userIsHost = host_id === userId

  return (
    <Grid
      container
      direction="row"
      justify="flex-start"
      alignItems="center"
      wrap="nowrap"
      className={classes.container}
    >
      {userIsHost && (
        <Grid container direction="column">
          <Grid container direction="row" alignItems="flex-end">
            <Button variant="contained" color="primary">
              End Event
            </Button>
          </Grid>
        </Grid>
      )}
      <Grid
        container
        justify="flex-end"
        alignItems="center"
        className={classes.settingsAndChatGrid}
      >
        <SetupMicAndCameraButton setUserHasEnabledCameraAndMic={setUserHasEnabledCameraAndMic} />
      </Grid>
    </Grid>
  )
}

export default GroupVideoChatBottomPanel
