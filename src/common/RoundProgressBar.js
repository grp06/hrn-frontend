import React, { useState, useEffect, useRef } from 'react'

import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/styles'
import LinearProgress from '@material-ui/core/LinearProgress'
import TimerIcon from '@material-ui/icons/Timer'
import { useAppContext } from '../context/useAppContext'
import { Snack } from '.'

const useStyles = makeStyles((theme) => ({
  roundProgressBarContainer: {
    width: '100%',
    height: 20,
    position: 'fixed',
    bottom: 0,
  },
}))

const RoundProgressBar = ({ myRound, event, hasPartnerAndIsConnecting }) => {
  const classes = useStyles()
  const { user } = useAppContext()
  const { updatedAt } = user
  const [showRoundStartedSnack, setShowRoundStartedSnack] = useState(false)
  const [show15SecondsLeftSnack, setShow15SecondsLeftSnack] = useState(false)
  const hasStartedConnectingToPartner = useRef()
  const getDuration = () => {
    const { status } = event
    if (status === 'room-in-progress') {
      return event.round_length * 60000
    }
    return 10000
  }

  const roundEndTime = new Date(event.updated_at).getTime() + getDuration()
  const isLast15Seconds = roundEndTime - new Date(updatedAt).getTime() < 15000

  useEffect(() => {
    if (isLast15Seconds) {
      setShow15SecondsLeftSnack(true)
    }
  }, [isLast15Seconds])

  const getMsFromRoundStart = () => {
    const { status, updated_at } = event

    const latestUpdateFromServer = new Date(updatedAt).getTime()

    if (status === 'room-in-progress') {
      const roundStartTime = new Date(event.updated_at).getTime()

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
        setShowRoundStartedSnack(true)
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
      <Snack
        open={showRoundStartedSnack}
        onClose={() => setShowRoundStartedSnack(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        duration={6000}
        severity="success"
        snackIcon={<TimerIcon />}
        snackMessage={`${event.round_length} mintues left`}
      />
      <Snack
        open={show15SecondsLeftSnack}
        onClose={() => setShow15SecondsLeftSnack(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        duration={6000}
        severity="error"
        snackMessage="15 seconds left!"
      />
      <LinearProgress variant="determinate" value={currentPercentWayThrough} />
    </Grid>
  )
}

export default RoundProgressBar
