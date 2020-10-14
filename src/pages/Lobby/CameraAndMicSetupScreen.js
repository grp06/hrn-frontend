import React from 'react'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/styles'
import { SetupMicAndCamera } from '../Event'

const useStyles = makeStyles((theme) => ({
  previewVideo: {
    width: '100%',
    height: '500px',
    backgroundColor: 'black',
  },
  screenContainer: {
    height: '100vh',
    width: '100vw',
    position: 'absolute',
    backgroundColor: theme.palette.common.dankPurp,
  },
  videoAndSelectionContainer: {
    width: '85%',
    height: '100%',
    margin: 'auto',
  },
}))

const CameraAndMicSetupScreen = () => {
  const classes = useStyles()
  return (
    <Grid container justify="center" alignItems="center" className={classes.screenContainer}>
      <Grid
        container
        direction="row"
        justify="space-around"
        alignItems="center"
        className={classes.videoAndSelectionContainer}
      >
        <Grid item md={5}>
          <video autoPlay id="videoElement" muted className={classes.previewVideo} />
        </Grid>
        <Grid item md={7}>
          <SetupMicAndCamera />
        </Grid>
      </Grid>
    </Grid>
  )
}

export default CameraAndMicSetupScreen
