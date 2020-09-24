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

const RoundProgressBar = React.memo(({ event, userUpdatedAt }) => {
  const classes = useStyles()
  const { round_length, status: eventStatus, updated_at: eventUpdatedAt } = event
  const [timeElapsedInRound, setTimeElapsedInRound] = useState(null)
  const [progressBarValue, setProgressBarValue] = useState(null)
  const [showRoundStartedSnack, setShowRoundStartedSnack] = useState(false)
  const [show20SecondsLeftSnack, setShow20SecondsLeftSnack] = useState(false)
  const [alreadyShown20SecondsLeftSnack, setAlreadyShown20SecondsLeftSnack] = useState(false)

  // TODO: have to add a last seen mutation somewhere on componentDidMount on VideoRoom
  // because if we refresh we never send a last seen mutation, so it will be null?

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
    const timeElapsedInRoundAlready = getTimeElapsedInRoundAlready()

    const duration = getRoundDuration()

    return (timeElapsedInRoundAlready / duration) * 100
  }

  useEffect(() => {
    if (!progressBarValue) {
      const progressPercent = getPercentElapsedThroughRound()

      console.log('setting progress bar for first time')
      setProgressBarValue(progressPercent)
    }
  }, [userUpdatedAt])

  useEffect(() => {
    setProgressBarValue(0)
    setAlreadyShown20SecondsLeftSnack(false)
  }, [eventStatus])

  useEffect(() => {
    if (!progressBarValue) {
      const percentElapsedThroughRound = getPercentElapsedThroughRound()
      setProgressBarValue(percentElapsedThroughRound)
    }
    const interval = setInterval(() => {
      const oneSecondInPct = (1000 / (round_length * 60000)) * 100

      // setTimeElapsedInRound((seconds) => seconds + 1000)

      setProgressBarValue((oldVal) => oldVal + oneSecondInPct)
    }, 1000)

    // if (!alreadyShown20SecondsLeftSnack && eventStatus === 'room-in-progress') {
    //   if (timeElapsedInRound > getRoundDuration() - 20000) {
    //     setShow20SecondsLeftSnack(true)
    //     setAlreadyShown20SecondsLeftSnack(true)
    //   }
    // }

    return () => {
      console.log('clearing')
      setProgressBarValue(null)
      clearInterval(interval)
    }
  }, [])

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
