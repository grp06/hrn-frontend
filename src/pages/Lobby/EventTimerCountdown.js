import React from 'react'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles((theme) => ({
  container: {
    position: 'fixed',
    bottom: 'auto',
    width: '100%',
    height: 'auto',
    padding: theme.spacing(2),
    backgroundColor: 'yellow',
  },
}))

const EventTimerCountdown = () => {
  const classes = useStyles()
  return (
    <Grid container justify="center" alignItems="center" className={classes.container}>
      Time until Event
    </Grid>
  )
}

export default EventTimerCountdown
