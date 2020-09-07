import React from 'react'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/styles'
import { LeaveChatButton } from '.'

const useStyles = makeStyles((theme) => ({
  controlsContainer: {
    position: 'fixed',
    top: 'auto',
    bottom: '5%',
    width: '100%',
    height: 'auto',
  },
}))

const VideoControlsPanel = ({ myRound }) => {
  const classes = useStyles()
  return (
    <Grid container justify="center" alignItems="center" className={classes.controlsContainer}>
      <LeaveChatButton myRound={myRound} />
    </Grid>
  )
}

export default VideoControlsPanel
