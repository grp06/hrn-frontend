import React, { useState, useEffect } from 'react'
import moment from 'moment-timezone'

import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/styles'
import { useAppContext } from '../context/useAppContext'

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

const Timer = ({ eventStartTime, onRoundComplete, myRound, event }) => {
  const { user } = useAppContext()
  const { updatedAt } = user
  const realStartTime = new Date(myRound.started_at).getTime()
  const latestUpdateFromServer = new Date(updatedAt).getTime()
  console.log('Timer -> latestUpdateFromServer', latestUpdateFromServer)
  const realEndTime = realStartTime + (event.round_length || 5) * 60
  const classes = useStyles()
  // const roundEndsAt = moment(myRound.started_at).seconds(
  //   // round length is measured in minutes and stored as an int
  //   roundStartedAtInSeconds + (event.round_length || 5) * 60
  // )
  // console.log("Timer -> roundEndsAt", roundEndsAt)
  const now = moment()
  const duration = moment.duration(moment(eventStartTime).diff(now))
  const secondsUntilEvent = Math.trunc(duration._milliseconds / 1000)
  console.log('Timer -> secondsUntilEvent', secondsUntilEvent)
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
      if (onRoundComplete) {
        onRoundComplete()
      }
    }

    return () => {
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
