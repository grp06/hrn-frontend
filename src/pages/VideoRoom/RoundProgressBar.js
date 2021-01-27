import React, { useState, useEffect, useRef } from 'react'

import Grid from '@material-ui/core/Grid'
import LinearProgress from '@material-ui/core/LinearProgress'
import Typography from '@material-ui/core/Typography'
import TimerIcon from '@material-ui/icons/Timer'
import { makeStyles } from '@material-ui/styles'
import { motion } from 'framer-motion'
import { constants } from '../../utils'
import { Snack } from '../../common'

const { betweenRoundsDelay, bottomNavBarHeight } = constants

const useStyles = makeStyles((theme) => ({
  animatedCountdown: {
    position: 'fixed',
    zIndex: 9999999,
    height: '500px',
    width: '500px',
    borderRadius: 360,
    backgroundColor: theme.palette.common.basePurple,
    margin: 'auto',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
  },
  animatedBackdrop: {
    position: 'fixed',
    zIndex: 9999988,
    height: '100vh',
    width: '100vw',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: 'black',
    opacity: 0,
  },
  countdownNumber: {
    fontSize: '20rem',
    textAlign: 'center',
    color: theme.palette.common.ghostWhite,
  },
  roundProgressBarContainer: {
    width: '100%',
    // height: 20,
    position: 'fixed',
    bottom: bottomNavBarHeight,
  },
}))

const RoundProgressBar = React.memo(({ event, userUpdatedAt }) => {
  const classes = useStyles()
  const { round_length, status: eventStatus, updated_at: eventUpdatedAt } = event

  const [progressBarValue, setProgressBarValue] = useState(null)
  const [showRoundStartedSnack, setShowRoundStartedSnack] = useState(false)
  const [show20SecondsLeftSnack, setShow20SecondsLeftSnack] = useState(false)
  const [countdown321, setCountdown321] = useState(null)
  const [animateBackdrop, setAnimateBackdrop] = useState(false)
  const oneRoundInMs = round_length * 60000
  const getRoundDuration = () => {
    if (eventStatus === 'room-in-progress' || eventStatus === 'call-in-progress') {
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
    setShow20SecondsLeftSnack(false)
    setAnimateBackdrop(false)
    setCountdown321(null)
    setProgressBarValue(0)
  }, [eventStatus])

  useEffect(() => {
    const getOneSecondInPct = () => {
      if (eventStatus === 'in-between-rounds' && event.current_round === event.num_rounds) {
        // if its the last roond, the round length is 1/2
        return (1000 / (betweenRoundsDelay / 2)) * 100
      }
      if (eventStatus === 'in-between-rounds') {
        // ex: one tick of the progress bar is 5%
        return (1000 / betweenRoundsDelay) * 100
      }

      return (1000 / (round_length * 60000)) * 100
    }

    const oneSecInPct = getOneSecondInPct()

    if (!progressBarValue) {
      const percentElapsedThroughRound = getPercentElapsedThroughRound()

      setProgressBarValue(percentElapsedThroughRound + oneSecInPct)

      if (eventStatus === 'room-in-progress' || eventStatus === 'call-in-progress') {
        setShowRoundStartedSnack(true)
      }
    }

    const interval = setInterval(() => {
      setProgressBarValue((oldVal) => {
        const newPct = oldVal + oneSecInPct
        if (newPct > 100) {
          clearInterval(interval)
          return 100
        }

        if (!show20SecondsLeftSnack && eventStatus !== 'in-between-rounds') {
          const timeRightNow = (newPct / 100) * oneRoundInMs
          const isLast30Seconds = oneRoundInMs - timeRightNow < 30000
          const isLast3Seconds = oneRoundInMs - timeRightNow < 3000
          // dont show 3.2.1. for meet and greet app
          if (isLast3Seconds && eventStatus !== 'call-in-progress') {
            setCountdown321(Math.ceil((oneRoundInMs - timeRightNow) / 1000))
            if (!animateBackdrop) {
              setAnimateBackdrop(true)
            }
          }
          if (isLast30Seconds) {
            setShow20SecondsLeftSnack(true)
            setShowRoundStartedSnack(false)
          }
        }

        return newPct
      })
    }, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [eventStatus])

  const snackPosition = eventStatus === 'call-in-progress' ? 'top' : 'bottom'

  return (
    <>
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
        className={classes.roundProgressBarContainer}
        style={eventStatus === 'call-in-progress' ? { bottom: 0 } : {}}
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
        anchorOrigin={{ vertical: snackPosition, horizontal: 'center' }}
        duration={10000}
        severity="success"
        snackIcon={<TimerIcon />}
        snackMessage={`${event.round_length} minutes left`}
      />
      <Snack
        open={show20SecondsLeftSnack}
        onClose={() => setShow20SecondsLeftSnack(false)}
        anchorOrigin={{ vertical: snackPosition, horizontal: 'center' }}
        duration={15000}
        severity="error"
        snackMessage="15 seconds left!"
      />
    </>
  )
})

export default RoundProgressBar
