import React, { useEffect, useState } from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles((theme) => ({
  container: {
    position: 'absolute',
    zIndex: '999',
    width: '73vw',
    height: 'auto',
    [theme.breakpoints.down('md')]: {
      width: '68vw',
    },
    padding: theme.spacing(1),
    borderRadius: '4px',
    border: '2px solid #3e4042',
    boxShadow: '5px 5px 0 #3e4042',
    backgroundColor: theme.palette.common.greyCard,
    top: '5.5%',
  },
  normalText: {
    fontWeight: '200',
    color: theme.palette.common.ghostWhiteDark,
  },
}))

const NextRoundIn = ({ currentRound, eventUpdatedAt, roundLength }) => {
  const classes = useStyles()
  const [minutesUntilNextRound, setMinutesUntilNextRound] = useState(null)

  const calculateMinutesUntilNextRound = () => {
    console.log('currentRound ->', currentRound)
    console.log('eventUpdatedAt ->', eventUpdatedAt)
    const timeRoundStarted = new Date(eventUpdatedAt).getTime()
    const timeRoundEndsAt = timeRoundStarted + roundLength * 60000
    const secondsUntilNextRound = timeRoundEndsAt - Date.now()
    console.log('timeRoundStarted ->', timeRoundStarted)
    console.log('timeRoundEndsAt ->', timeRoundEndsAt)
    const minutesLeft = Math.ceil(secondsUntilNextRound / 60000)
    console.log(secondsUntilNextRound / 60000)
    console.log('minutesLeft ->', minutesLeft)
    setMinutesUntilNextRound(`under ${minutesLeft} minute(s)`)
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

  return (
    <div className={classes.container}>
      <Grid container direction="column" justify="center" alignItems="center">
        <Typography variant="h6">
          <span className={classes.normalText}>Current Round:</span> {currentRound}
        </Typography>
        <Typography variant="h6">
          <span className={classes.normalText}>Next Round In:</span> {minutesUntilNextRound}
        </Typography>
      </Grid>
    </div>
  )
}

export default NextRoundIn
