import React, { useState, useEffect } from 'react'

import TimerIcon from '@material-ui/icons/Timer'
import { motion } from 'framer-motion'
import { Grid, LinearProgress, Typography } from '@material-ui/core'
import { constants } from '../../utils'
import { Snack } from '../../common'
import { useVideoRoomStyles } from '.'

const { betweenRoundsDelay } = constants

const RoundProgressBar = React.memo(({ event, userUpdatedAt }) => {
  const classes = useVideoRoomStyles()
  const { round_length, status: eventStatus, updated_at: eventUpdatedAt } = event
  const [progressBarValue, setProgressBarValue] = useState(null)
  const [showRoundStartedSnack, setShowRoundStartedSnack] = useState(false)
  const [showSecondsLeftSnack, setShowSecondsLeftSnack] = useState(null)
  const [countdown321, setCountdown321] = useState(null)
  const [animateBackdrop, setAnimateBackdrop] = useState(false)
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
    setShowSecondsLeftSnack(null)
    setAnimateBackdrop(false)
    setCountdown321(null)
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
      if (eventStatus === 'room-in-progress' && percentElapsedThroughRound < 10) {
        setShowRoundStartedSnack(true)
      }
    }

    const interval = setInterval(() => {
      setProgressBarValue((oldVal) => {
        const newPct = oldVal + getOneSecondInPct()
        if (!showSecondsLeftSnack && eventStatus !== 'in-between-rounds') {
          const timeRightNow = (newPct / 100) * oneRoundInMs
          const isLast3Seconds = oneRoundInMs - timeRightNow < 3000
          if (isLast3Seconds) {
            setCountdown321(Math.ceil((oneRoundInMs - timeRightNow) / 1000))
            if (!animateBackdrop) {
              setAnimateBackdrop(true)
            }
          } else {
            const roundedMinutes = Math.floor((oneRoundInMs - timeRightNow) / 1000) * 1000

            if (oneRoundInMs - timeRightNow < 60000 && roundedMinutes % 30000 === 0) {
              setShowSecondsLeftSnack('30 seconds left!')
              setShowRoundStartedSnack(false)
            } else if (!showRoundStartedSnack && roundedMinutes % 60000 === 0) {
              const minutesLeftResult = Math.floor((oneRoundInMs - timeRightNow) / 60000)
              setShowSecondsLeftSnack(
                `${minutesLeftResult} ${minutesLeftResult === 1 ? 'minute' : 'minutes'} left!`
              )
            }
          }
        }
        return newPct
      })
    }, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [eventStatus])

  return (
    <>
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
        className={classes.roundProgressBarContainer}
      >
        {countdown321 ? (
          <motion.div
            animate={{ scale: 0, rotate: 360 }}
            transition={{ duration: 2.9 }}
            className={classes.animatedCountdown}
          >
            <Grid container justify="center" alignItems="center">
              <Typography className={classes.countdownNumber}>{countdown321}</Typography>
            </Grid>
          </motion.div>
        ) : null}
        {animateBackdrop ? (
          <motion.div
            animate={{ opacity: 1 }}
            transition={{ duration: 2.9 }}
            className={classes.animatedBackdrop}
          />
        ) : null}
        <LinearProgress variant="determinate" value={progressBarValue} />
      </Grid>
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
        open={!!showSecondsLeftSnack}
        onClose={() => setShowSecondsLeftSnack(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        duration={15000}
        severity="error"
        snackMessage={showSecondsLeftSnack}
      />
    </>
  )
})

export default RoundProgressBar
