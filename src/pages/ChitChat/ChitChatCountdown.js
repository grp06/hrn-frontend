import React, { useState, useEffect } from 'react'
import moment from 'moment-timezone'
import Grid from '@material-ui/core/Grid'
import LinearProgress from '@material-ui/core/LinearProgress'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/styles'
import { getTimeUntilEvent } from '../../utils'

const useStyles = makeStyles((theme) => ({
  container: {
    position: 'fixed',
    zIndex: 999,
    width: '100%',
    bottom: 0,
    height: 'auto',
    top: 'auto',
    backgroundColor: theme.palette.common.greyCard,
    marginLeft: theme.spacing(-2),
    padding: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      backgroundColor: 'rgb(36,37,38,0.7)',
      bottom: 'auto',
      top: 0,
    },
  },
  time: {
    fontFamily: 'Muli',
    color: theme.palette.common.ghostWhite,
    fontWeight: '700',
    fontSize: '2.25rem',
    marginRight: theme.spacing(1),
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

const ChitChatCountdown = ({ eventStartTime }) => {
  const classes = useStyles()
  const [seconds, setSeconds] = useState(null)
  const [eventStartingWithin15Mins, setEventStartingWithin15Mins] = useState(false)
  const [showNumberCountdown, setShowNumberCountdown] = useState(true)

  useEffect(() => {
    const now = moment()
    const duration = moment.duration(moment(eventStartTime).diff(now))
    const secondsUntilEvent = Math.trunc(duration._milliseconds / 1000)
    setSeconds(secondsUntilEvent)
  }, [])

  useEffect(() => {
    const timeUntilEvent = getTimeUntilEvent(eventStartTime)
    if (timeUntilEvent < 900000) setEventStartingWithin15Mins(true)
  }, [seconds])

  useEffect(() => {
    let interval = null
    interval = setInterval(() => {
      setSeconds((seconds) => seconds - 1)
    }, 1000)

    if (Math.sign(seconds) === -1 || 0) {
      setShowNumberCountdown(false)
    }
    return () => {
      clearInterval(interval)
    }
  }, [seconds])

  const displayTime =
    seconds && seconds >= 0
      ? `${Math.floor(seconds / 60)} : ${seconds - Math.floor(seconds / 60) * 60}`
      : '-- : --'

  const renderCountdown = () => {
    return showNumberCountdown ? (
      <Typography variant="h3">
        <span className={classes.time}>{displayTime}</span> until event starts
      </Typography>
    ) : (
      <div>
        <Grid container item direction="column" justify="center" alignItems="center">
          <Typography variant="h3" className={classes.centerText}>
            Event starting soon
          </Typography>
        </Grid>
        <div className={classes.root}>
          <LinearProgress />
        </div>
      </div>
    )
  }

  return (
    <Grid
      container
      direction="column"
      justify="center"
      alignItems="center"
      className={classes.container}
    >
      {eventStartingWithin15Mins ? renderCountdown() : null}
    </Grid>
  )
}

export default ChitChatCountdown
