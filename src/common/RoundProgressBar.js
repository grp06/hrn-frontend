import React, { useState, useEffect, useRef } from 'react'

import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/styles'
import LinearProgress from '@material-ui/core/LinearProgress'
import Snackbar from '@material-ui/core/Snackbar'
import MuiAlert from '@material-ui/lab/Alert'
import TimerIcon from '@material-ui/icons/Timer'
import { useAppContext } from '../context/useAppContext'

const useStyles = makeStyles((theme) => ({
  roundProgressBarContainer: {
    width: '100%',
    height: 20,
    position: 'fixed',
    bottom: 0,
  },
  roundStartedMessage: {
    padding: '10px 30px',
  },
}))
const Alert = (props) => <MuiAlert elevation={6} variant="filled" {...props} />

const RoundProgressBar = ({ myRound, event, hasPartnerAndIsConnecting }) => {
  const classes = useStyles()
  const { user } = useAppContext()
  const { updatedAt } = user
  const [showRoundStartedMessage, setShowRoundStartedMessage] = useState(false)
  const [show15SecondsLeftWarning, setShow15SecondsLeftWarning] = useState(false)
  const hasStartedConnectingToPartner = useRef()
  const getDuration = () => {
    const { status } = event
    if (status === 'room-in-progress') {
      return event.round_length * 60000
    }
    return 20000
  }

  const roundEndTime = new Date(myRound.started_at).getTime() + getDuration()
  const isLast15Seconds = roundEndTime - new Date(updatedAt).getTime() < 15000

  useEffect(() => {
    if (isLast15Seconds) {
      setShow15SecondsLeftWarning(true)
    }
  }, [isLast15Seconds])

  const getMsFromRoundStart = () => {
    const { status, updated_at } = event

    const latestUpdateFromServer = new Date(updatedAt).getTime()

    if (status === 'room-in-progress') {
      const roundStartTime = new Date(myRound.started_at).getTime()

      return latestUpdateFromServer - roundStartTime
    }
    const roundStartTime = new Date(updated_at).getTime()
    return latestUpdateFromServer - roundStartTime
  }

  const msFromStart = getMsFromRoundStart()
  const duration = getDuration()
  const currentPercentWayThrough = (msFromStart / duration) * 100

  if (hasPartnerAndIsConnecting) {
    hasStartedConnectingToPartner.current = true
  }

  useEffect(() => {
    // make sure we've already started the process of connecting, and that the connection has been made, and its within 45sec of round start
    // this way, it won't show up on refresh if they're in the middle of the round
    if (hasStartedConnectingToPartner && !hasPartnerAndIsConnecting && msFromStart < 45000) {
      // without this, the green banner annoyingly shows up right before the connecting screen
      setTimeout(() => {
        setShowRoundStartedMessage(true)
      }, 3000)
    }
  }, [hasPartnerAndIsConnecting])

  return (
    <Grid
      container
      direction="row"
      justify="center"
      alignItems="center"
      className={classes.roundProgressBarContainer}
    >
      <Snackbar
        open={showRoundStartedMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        autoHideDuration={10000}
        onClose={() => setShowRoundStartedMessage(false)}
      >
        <Alert severity="success" icon={<TimerIcon />} className={classes.roundStartedMessage}>
          {`${event.round_length} mintues left`}
        </Alert>
      </Snackbar>
      <Snackbar
        open={show15SecondsLeftWarning}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        autoHideDuration={8000}
        onClose={() => setShow15SecondsLeftWarning(false)}
      >
        <Alert severity="error" className={classes.roundStartedMessage}>
          15 seconds left. Wrap it up!
        </Alert>
      </Snackbar>
      <LinearProgress variant="determinate" value={currentPercentWayThrough} />
    </Grid>
  )
}

export default RoundProgressBar
