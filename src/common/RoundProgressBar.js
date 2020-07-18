import React from 'react'

import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/styles'
import LinearProgress from '@material-ui/core/LinearProgress'
import { useAppContext } from '../context/useAppContext'

const useStyles = makeStyles((theme) => ({
  roundProgressBarContainer: {
    width: '100%',
    height: 20,
    position: 'fixed',
    bottom: 0,
  },
}))

const RoundProgressBar = ({ myRound, event }) => {
  const classes = useStyles()
  const { user } = useAppContext()
  const { updatedAt } = user

  const getDuration = () => {
    const { status } = event
    if (status === 'room-in-progress') {
      return event.round_length * 60000
    }
    return 20000
  }

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

  return (
    <Grid
      container
      direction="row"
      justify="center"
      alignItems="center"
      className={classes.roundProgressBarContainer}
    >
      <LinearProgress variant="determinate" value={currentPercentWayThrough} />
    </Grid>
  )
}

export default RoundProgressBar
