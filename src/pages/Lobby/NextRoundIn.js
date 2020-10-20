import React, { useEffect, useState } from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles((theme) => ({
  container: {
    position: 'fixed',
    zIndex: 999,
    bottom: 'auto',
    width: '100%',
    height: 'auto',
    top: '0',
    backgroundColor: 'rgb(36,37,38,0.7)',
    padding: theme.spacing(2),
  },
  normalText: {
    fontWeight: '200',
    color: theme.palette.common.ghostWhiteDark,
  },
}))

const NextRoundIn = ({ currentRound, eventStatus, eventUpdatedAt, roundLength }) => {
  const classes = useStyles()
  const [minutesUntilNextRound, setMinutesUntilNextRound] = useState(null)

  const calculateMinutesUntilNextRound = () => {
    const timeRoundStarted = new Date(eventUpdatedAt).getTime()
    const timeRoundEndsAt = timeRoundStarted + roundLength * 60000
    const secondsUntilNextRound = timeRoundEndsAt - Date.now()
    const minutesLeft = Math.ceil(secondsUntilNextRound / 60000)
    const message = minutesLeft > 1 ? `under ${minutesLeft} minutes` : `under ${minutesLeft} minute`
    setMinutesUntilNextRound(message)
  }

  useEffect(() => {
    calculateMinutesUntilNextRound()
  }, [currentRound, eventUpdatedAt])

  useEffect(() => {
    const interval = setInterval(() => {
      calculateMinutesUntilNextRound()
    }, 20000)

    return () => {
      clearInterval(interval)
    }
  }, [minutesUntilNextRound])

  const renderMessage = () => {
    return eventStatus === 'room-in-progress' ? (
      <>
        <Typography variant="h6">
          <span className={classes.normalText}>Current round:</span> {currentRound}
        </Typography>
        <Typography variant="h6">
          <span className={classes.normalText}>Next round in:</span> {minutesUntilNextRound}
        </Typography>
      </>
    ) : (
      <>
        <Typography variant="h6">
          Waking up Alfred, our matching AI{' '}
          <span role="img" aria-label="robot">
            🤖
          </span>
          <span role="img" aria-label="sleepy zzz">
            💤
          </span>
        </Typography>
        <Typography variant="h6">Give him 20 seconds to start the next round.</Typography>
      </>
    )
  }

  return eventStatus ? (
    <div className={classes.container}>
      <Grid container direction="column" justify="center" alignItems="center">
        {renderMessage()}
      </Grid>
    </div>
  ) : null
}

export default NextRoundIn
