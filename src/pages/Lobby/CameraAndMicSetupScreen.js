import React from 'react'

import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/styles'
import confettiDoodles from '../../assets/confettiDoodles.svg'
import { SetupMicAndCamera } from '.'

const useStyles = makeStyles((theme) => ({
  previewVideo: {
    width: '100%',
    height: 'auto',
    backgroundColor: 'black',
    borderRadius: '4px',
  },
  screenContainer: {
    height: '100vh',
    width: '100vw',
    position: 'absolute',
    backgroundImage: `url(${confettiDoodles})`,
  },
  videoAndSelectionContainer: {
    width: '85%',
    height: 'auto',
    margin: 'auto',
    borderRadius: '4px',
    padding: theme.spacing(3),
    backgroundColor: theme.palette.common.grey10,
  },
}))

const CameraAndMicSetupScreen = ({ usersName }) => {
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
