import React from 'react'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  cardContainer: {
    backgroundColor: theme.palette.common.greyCard,
    borderRadius: '4px',
    height: 'auto',
    padding: theme.spacing(3, 5),
    width: '100%',
  },
}))

const SittingOut = ({ setUserEventStatus }) => {
  const classes = useStyles()

  const handleRejoinEventClick = () => {
    setUserEventStatus('waiting for match')
  }
  return (
    <Grid
      container
      direction="column"
      justify="flex-start"
      alignItems="flex-start"
      className={classes.cardContainer}
    >
      <Typography variant="h2">
        You are sitting out of the event{' '}
        <span role="img" aria-label="sad face">
          😢
        </span>
      </Typography>
      <Typography variant="h3">
        Your name won&apos;t be thrown in the hat for the matching algorithm. Whenever you&apos;re
        ready to join again, just hit the button below.
      </Typography>
      <Typography variant="h3">We can&apos;t wait until you&apos;re back in the event!</Typography>
      <Button variant="contained" size="large" color="primary" onClick={handleRejoinEventClick}>
        Rejoin Event
      </Button>
    </Grid>
  )
}

export default SittingOut
