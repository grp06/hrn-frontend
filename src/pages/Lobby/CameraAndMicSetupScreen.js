import React from 'react'
import { Grid } from '@material-ui/core'
import { SetupMicAndCamera, useLobbyStyles } from '.'

const CameraAndMicSetupScreen = ({ usersName }) => {
  const classes = useLobbyStyles()
  return (
    <Grid
      container
      justify="center"
      alignItems="center"
      className={classes.cameraAndMicSetupScreenContainer}
    >
      <Grid
        container
        direction="row"
        justify="space-around"
        alignItems="center"
        className={classes.videoAndMicSelectionContainer}
      >
        <Grid item md={6}>
          <video autoPlay id="videoElement" muted className={classes.previewVideo} />
        </Grid>
        <Grid item md={6}>
          <SetupMicAndCamera usersName={usersName} />
        </Grid>
      </Grid>
    </Grid>
  )
}

export default CameraAndMicSetupScreen
