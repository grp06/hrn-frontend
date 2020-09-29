import React, { useState, useEffect, useRef } from 'react'

import Grid from '@material-ui/core/Grid'
import LinearProgress from '@material-ui/core/LinearProgress'
import TimerIcon from '@material-ui/icons/Timer'
import { makeStyles } from '@material-ui/styles'
import { constants } from '../../utils'
import { Snack } from '../../common'

const { betweenRoundsDelay } = constants

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
  const [progressBarValue, setProgressBarValue] = useState(null)
  const [showRoundStartedSnack, setShowRoundStartedSnack] = useState(false)
  const [show20SecondsLeftSnack, setShow20SecondsLeftSnack] = useState(false)
  const oneRoundInMs = round_length * 60000
  const getRoundDuration = () => {
    if (eventStatus === 'room-in-progress') {
      return round_length * 60000
    }
    // needs to match round_interval on the backend
    // this is for in-between-rounds
    return 20000
  }

  const getTimeElapsedInRoundAlready = () => {
    const timeUserEnteredRound = new Date(userUpdatedAt).getTime() + 50

    const timeRoundStarted = new Date(eventUpdatedAt).getTime()

    return timeUserEnteredRound - timeRoundStarted
  }

  const getPercentElapsedThroughRound = () => {
    const timeElapsedInRoundAlready = getTimeElapsedInRoundAlready()

    const duration = getRoundDuration()

    return (timeElapsedInRoundAlready / duration) * 100
  }

  useEffect(() => {
    setShow20SecondsLeftSnack(false)
    setProgressBarValue(0)
  }, [eventStatus])

  useEffect(() => {
    const getOneSecondInPct = () => {
      if (eventStatus === 'in-between-rounds' && event.current_round === event.num_rounds) {
        // ex: one tick of the progress bar is 10%

        return (1000 / (betweenRoundsDelay / 2)) * 100
      }
      if (eventStatus === 'in-between-rounds') {
        // ex: one tick of the progress bar is 5%
        return (1000 / betweenRoundsDelay) * 100
      }
      return (1000 / (round_length * 60000)) * 100
    }

    if (!progressBarValue) {
      const percentElapsedThroughRound = getPercentElapsedThroughRound()
      setProgressBarValue(percentElapsedThroughRound + getOneSecondInPct())
      if (eventStatus === 'room-in-progress') {
        setShowRoundStartedSnack(true)
      }
    }

    const interval = setInterval(() => {
      setProgressBarValue((oldVal) => {
        const newPct = oldVal + getOneSecondInPct()
        if (!show20SecondsLeftSnack && eventStatus !== 'in-between-rounds') {
          const timeRightNow = (newPct / 100) * oneRoundInMs
          const isLastTwentySecs = oneRoundInMs - timeRightNow < 20000
          if (isLastTwentySecs) {
            setShow20SecondsLeftSnack(true)
            setShowRoundStartedSnack(false)
          }
        }
        return newPct
      })
    }, 1000)

    return () => {
      console.log('clearing')
      clearInterval(interval)
    }
  }, [eventStatus])

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
        duration={10000}
        severity="success"
        snackIcon={<TimerIcon />}
        snackMessage={`${event.round_length} minutes left`}
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
