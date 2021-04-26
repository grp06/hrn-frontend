import React, { useCallback, useState, useEffect } from 'react'
import moment from 'moment-timezone'
import { Grid, LinearProgress, Typography } from '@material-ui/core'
import { useLobbyStyles } from '.'

const EventCountdown = ({ eventStartTime }) => {
  const classes = useLobbyStyles()
  const [seconds, setSeconds] = useState(null)
  const [isTimerActive, setIsTimerActive] = useState(true)

  const getSecondsUntilEventStarts = useCallback(() => {
    const now = moment()
    const duration = moment.duration(moment(eventStartTime).diff(now))
    return Math.trunc(duration._milliseconds / 1000)
  }, [eventStartTime])

  useEffect(() => {
    const secondsUntilEvent = getSecondsUntilEventStarts()
    setSeconds(secondsUntilEvent)
  }, [getSecondsUntilEventStarts])

  useEffect(() => {
    let interval = null
    interval = setInterval(() => {
      setSeconds((seconds) => seconds - 1)
    }, 1000)

    if (Math.sign(seconds) === -1 || 0) {
      setIsTimerActive(false)
    }
    return () => {
      clearInterval(interval)
    }
  }, [seconds])

  const displayTime =
    seconds && seconds >= 0
      ? `${String(Math.floor(seconds / 60)).padStart(2, '0')} : ${String(
          seconds - Math.floor(seconds / 60) * 60
        ).padStart(2, '0')}`
      : '-- : --'

  return (
    <Grid
      container
      direction="column"
      justify="center"
      alignItems="center"
      className={classes.eventCountdownContainer}
    >
      {isTimerActive ? (
        <Typography variant="h3">
          <span className={classes.time}>{displayTime}</span> until event starts
        </Typography>
      ) : (
        <div>
          <Grid container item direction="column" justify="center" alignItems="center">
            <Typography variant="h3" style={{ textAlign: 'center' }}>
              The host will begin the event shortly
            </Typography>
          </Grid>
          <div className={classes.linearProgressRoot}>
            <LinearProgress />
          </div>
        </div>
      )}
    </Grid>
  )
}

export default EventCountdown
