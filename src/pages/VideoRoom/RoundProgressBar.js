import React, { useState, useEffect, useRef } from 'react'

import Grid from '@material-ui/core/Grid'
import LinearProgress from '@material-ui/core/LinearProgress'
import TimerIcon from '@material-ui/icons/Timer'
import { makeStyles } from '@material-ui/styles'

import { Snack } from '../../common'

const useStyles = makeStyles((theme) => ({
  roundProgressBarContainer: {
    width: '100%',
    height: 20,
    position: 'fixed',
    bottom: 0,
  },
}))

const RoundProgressBar = React.memo(({ event, hasPartnerAndIsConnecting, userUpdatedAt }) => {
  const classes = useStyles()
  const { round_length, status: eventStatus, updated_at: eventUpdatedAt } = event
  const [timeElapsedInRound, setTimeElapsedInRound] = useState(null)
  const [progressBarValue, setProgressBarValue] = useState(null)
  const [showRoundStartedSnack, setShowRoundStartedSnack] = useState(false)
  const [show20SecondsLeftSnack, setShow20SecondsLeftSnack] = useState(false)
  const hasStartedConnectingToPartner = useRef()

  if (hasPartnerAndIsConnecting) {
    hasStartedConnectingToPartner.current = true
  }

  const getRoundDuration = () => {
    if (eventStatus === 'room-in-progress') {
      return round_length * 60000
    }
    // needs to match round_interval on the backend
    // this is for in-between-rounds
    return 20000
  }

  const getTimeElapsedInRoundAlready = () => {
    const timeUserEnteredRound = new Date(userUpdatedAt).getTime()
    const timeRoundStarted = new Date(eventUpdatedAt).getTime()
    return timeUserEnteredRound - timeRoundStarted
  }

  const getPercentElapsedThroughRound = () => {
    const timeElapsedInRoundAlready = timeElapsedInRound || getTimeElapsedInRoundAlready()
    const duration = getRoundDuration()
    return (timeElapsedInRoundAlready / duration) * 100
  }

  useEffect(() => {
    const seconds = getTimeElapsedInRoundAlready()
    const progressPercent = getPercentElapsedThroughRound()
    setTimeElapsedInRound(seconds)
    setProgressBarValue(progressPercent)
  }, [])

  useEffect(() => {
    setTimeElapsedInRound(0)
  }, [eventStatus])

  useEffect(() => {
    // make sure we've already started the process of connecting, and that the connection has been made, and its within 45sec of round start
    // this way, it won't show up on refresh if they're in the middle of the round
    if (
      hasStartedConnectingToPartner &&
      !hasPartnerAndIsConnecting &&
      timeElapsedInRound < 45000 &&
      eventStatus === 'room-in-progress'
    ) {
      // without this, the green banner annoyingly shows up right before the connecting screen
      setTimeout(() => {
        setShowRoundStartedSnack(true)
      }, 3000)
    }
  }, [hasPartnerAndIsConnecting, event])

  useEffect(() => {
    let interval = null
    interval = setInterval(() => {
      const percentElapsedThroughRound = getPercentElapsedThroughRound()
      setTimeElapsedInRound((seconds) => seconds + 1000)
      setProgressBarValue(percentElapsedThroughRound)
      console.log('percentElapsedThroughRound ->', percentElapsedThroughRound)
      console.log('timeElapsedInRound ->', timeElapsedInRound)
    }, 1000)

    if (timeElapsedInRound > getRoundDuration() - 20000) {
      setShow20SecondsLeftSnack(true)
    }

    return () => {
      clearInterval(interval)
    }
  }, [timeElapsedInRound])

  return (
    <Grid
      container
      direction="row"
      justify="center"
      alignItems="center"
      className={classes.roundProgressBarContainer}
    >
      <Snack
        open={showRoundStartedSnack}
        onClose={() => setShowRoundStartedSnack(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        duration={20000}
        severity="success"
        snackIcon={<TimerIcon />}
        snackMessage={`${event.round_length} mintues left`}
      />
      <Snack
        open={show20SecondsLeftSnack}
        onClose={() => setShow20SecondsLeftSnack(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        duration={20000}
        severity="error"
        snackMessage="20 seconds left!"
      />
      <LinearProgress variant="determinate" value={progressBarValue} />
    </Grid>
  )
})

export default RoundProgressBar
