import React, { useState, useEffect } from 'react'
import moment from 'moment-timezone'
import Grid from '@material-ui/core/Grid'
import LinearProgress from '@material-ui/core/LinearProgress'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(1, 3),
    borderRadius: '4px',
    border: '2px solid #3e4042',
    boxShadow: '5px 5px 0 #3e4042',
    backgroundColor: theme.palette.common.greyCard,
    width: 'auto',
    position: 'relative',
  },
  time: {
    fontFamily: 'Muli',
    color: theme.palette.common.ghostWhite,
  },
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
    position: 'absolute',
    left: 0,
    bottom: 0,
    right: 0,
    top: 'auto',
  },
}))

const EventCountdown = ({ displayContainer, eventStartTime }) => {
  const classes = useStyles()
  const [seconds, setSeconds] = useState(null)
  const [isTimerActive, setIsTimerActive] = useState(true)

  useEffect(() => {
    const now = moment()
    const duration = moment.duration(moment(eventStartTime).diff(now))
    const secondsUntilEvent = Math.trunc(duration._milliseconds / 1000)
    setSeconds(secondsUntilEvent)
  }, [])

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
      ? `${Math.floor(seconds / 60)} : ${seconds - Math.floor(seconds / 60) * 60}`
      : '-- : --'

  return (
    <Grid
      container
      direction="column"
      justify="center"
      alignItems="center"
      className={displayContainer && classes.container}
    >
      {isTimerActive ? (
        <Typography variant="h5">
          <span className={classes.time}>{displayTime}</span> until event starts
        </Typography>
      ) : (
        <div>
          <Grid container item direction="column" justify="center" alignItems="center">
            <Typography variant="h5" className={classes.centerText}>
              The host will begin the event shortly
            </Typography>
          </Grid>
          <div className={classes.root}>
            <LinearProgress />
          </div>
        </div>
      )}
    </Grid>
  )
}

export default EventCountdown
