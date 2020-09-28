import React from 'react'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/styles'
import { EventCountdown } from '../Event'

const useStyles = makeStyles((theme) => ({
  container: {
    position: 'fixed',
    bottom: 'auto',
    width: '100%',
    height: 'auto',
    top: '0.5%',
  },
}))

const EventTimerCountdown = ({ eventStartTime }) => {
  const classes = useStyles()
  return eventStartTime ? (
    <Grid container justify="center" alignItems="center" className={classes.container}>
      <EventCountdown eventStartTime={eventStartTime} />
    </Grid>
  ) : null
}

export default EventTimerCountdown
