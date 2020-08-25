import React, { useState, useEffect } from 'react'
import moment from 'moment-timezone'

import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(1),
    borderRadius: '4px',
    border: '2px solid #3e4042',
    boxShadow: '5px 5px 0 #3e4042',
    backgroundColor: theme.palette.common.greyCard,
    width: 'auto',
  },
  time: {
    fontSize: '2rem',
    fontFamily: 'Muli',
    color: theme.palette.common.ghostWhite,
  },
}))

const EventCountdown = ({ eventStartTime }) => {
  const classes = useStyles()
  const now = moment()
  const duration = moment.duration(moment(eventStartTime).diff(now))
  const secondsUntilEvent = Math.trunc(duration._milliseconds / 1000)
  const minutesToDisplay = Math.floor(secondsUntilEvent / 60)
  const secondsToDisplay = secondsUntilEvent - minutesToDisplay * 60

  const [seconds, setSeconds] = useState(secondsUntilEvent)
  const [isTimerActive, setIsTimerActive] = useState(true)

  // console.log(isTimerActive)
  // console.log(eventStartTime)
  // console.log(seconds)
  console.log('duration =>', duration)
  console.log('secondsUtileEvent =>', secondsUntilEvent)
  console.log('minutesToDisplay =>', minutesToDisplay)

  useEffect(() => {
    let interval = null
    interval = setInterval(() => {
      setSeconds((seconds) => seconds - 1)
    }, 1000)

    if (seconds === 0) {
      setIsTimerActive(false)
    }

    return () => {
      clearInterval(interval)
    }
  }, [seconds, secondsUntilEvent])

  const displayTime =
    seconds && seconds >= 0 ? `${minutesToDisplay} : ${secondsToDisplay}` : '-- : --'

  return isTimerActive ? (
    <Grid
      container
      direction="column"
      justify="center"
      alignItems="center"
      className={classes.container}
    >
      <div className={classes.time}>{displayTime}</div>
    </Grid>
  ) : null
}

export default EventCountdown
