import React, { useEffect, useState } from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles((theme) => ({
  container: {
    position: 'absolute',
    zIndex: '999',
    width: '68vw',
    height: '65px',
    [theme.breakpoints.down('md')]: {
      width: '61vw',
    },
    padding: theme.spacing(1),
    borderRadius: '4px',
    border: '2px solid #3e4042',
    boxShadow: '5px 5px 0 #3e4042',
    backgroundColor: theme.palette.common.greyCard,
    top: '3.5%',
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
