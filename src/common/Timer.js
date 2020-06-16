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
}))

const Timer = ({ eventStartTime, onRoundComplete }) => {
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
      // console.log('seconds = ', seconds)

      setSeconds((seconds) => seconds - 1)
    }, 1000)

    if (seconds === 0) {
      setIsTimerActive(false)
      if (onRoundComplete) {
        onRoundComplete()
      }
    }

    return () => {
      // console.log('timer is unmounting')
      clearInterval(interval)
    }
  }, [seconds])

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

export default Timer
