import React, { useState, useEffect } from 'react'
import moment from 'moment-timezone'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles((theme) => ({
  container: {
    padding: '20px',
  },
  time: {
    fontSize: '2rem',
    fontFamily: 'Muli',
    color: theme.palette.common.orchid,
  },
  subtitle: {
    ...theme.typography.body,
    fontWeight: '700',
  },
}))

const Timer = ({ eventStartTime, subtitle }) => {
  const classes = useStyles()
  const now = moment()
  const duration = moment.duration(moment(eventStartTime).diff(now))
  const secondsUntilEvent = Math.trunc(duration._milliseconds / 1000)
  const minutesToDisplay = Math.floor(secondsUntilEvent / 60)
  const secondsToDisplay = secondsUntilEvent - minutesToDisplay * 60

  const [seconds, setSeconds] = useState(secondsUntilEvent)
  const [isTimerActive, setIsTimerActive] = useState(true)

  useEffect(() => {
    let interval = null
    interval = setInterval(() => {
      setSeconds((seconds) => seconds - 1)
    }, 1000)

    if (seconds === 0) {
      setIsTimerActive(false)
    }
    return () => clearInterval(interval)
  }, [seconds])

  return isTimerActive ? (
    <Grid
      container
      direction="column"
      justify="center"
      alignItems="center"
      className={classes.container}
    >
      <Typography className={classes.subtitle}>{subtitle}</Typography>
      <div className={classes.time}>{`${minutesToDisplay} : ${secondsToDisplay}`}</div>
    </Grid>
  ) : null
}

export default Timer
