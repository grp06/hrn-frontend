import React, { useEffect, useState } from 'react'
import { Grid, Typography } from '@material-ui/core/'
import { useLobbyStyles } from '.'

const NextRoundIn = ({ currentRound, eventStatus, eventUpdatedAt, roundLength }) => {
  const classes = useLobbyStyles()
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
    <div className={classes.nextRoundInContainer}>
      <Grid container direction="column" justify="center" alignItems="center">
        {renderMessage()}
      </Grid>
    </div>
  ) : null
}

export default NextRoundIn
