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

  console.log('userUpdatedAt ->', userUpdatedAt)
  console.log('eventUpdatedAt ->', eventUpdatedAt)
  if (hasPartnerAndIsConnecting) {
    hasStartedConnectingToPartner.current = true
  }

  // get the duration of the round
  // get what time the round ends
  // get what time the round started at === eventUpdatedAt
  // get what time you entered the room at === userUpdatedAt(the last seen mutation that updates userUpdatedAt)
  // get the percentage of the timebar
  // how much time elapsed in round already === (timeYouEnter - startOfRound)
  // (timeElapsedInRound)/ (duration of round) * 100
  // increment time elapsed in round already every one second is useEffect
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
    console.log('timeUserEnteredRound ->', timeUserEnteredRound)
    console.log('timeRoundStarted ->', timeRoundStarted)
    return timeUserEnteredRound - timeRoundStarted
  }

  const getPercentElapsedThroughRound = () => {
    const timeElapsedInRoundAlready = timeElapsedInRound || getTimeElapsedInRoundAlready()
    const duration = getRoundDuration()
    console.log('timeElapsedInRoundAlready ->', timeElapsedInRoundAlready)
    return (timeElapsedInRoundAlready / duration) * 100
  }

  useEffect(() => {
    const seconds = getTimeElapsedInRoundAlready()
    const progressPercent = getPercentElapsedThroughRound()
    console.log('seconds ->', seconds)
    console.log('progressPerecent ->', progressPercent)
    setTimeElapsedInRound(seconds)
    setProgressBarValue(progressPercent)
  }, [])

  useEffect(() => {
    // make sure we've already started the process of connecting, and that the connection has been made, and its within 45sec of round start
    // this way, it won't show up on refresh if they're in the middle of the round
    if (
      hasStartedConnectingToPartner &&
      !hasPartnerAndIsConnecting &&
      timeElapsedInRound < 45000 &&
      eventStatus === 'room-in-progress'
    ) {
      console.log('RoundProgressBar -> status', eventStatus)
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

    if (timeElapsedInRound === getRoundDuration() - 20000) {
      setShow20SecondsLeftSnack(true)
    }

    return () => {
      clearInterval(interval)
    }
  }, [timeElapsedInRound, eventStatus])

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
