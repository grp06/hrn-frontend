import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles((theme) => ({
  waitingRoom: {
    width: '100%',
    height: '90%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    marginTop: '2%',
    overflowY: 'hidden',
    [theme.breakpoints.down('md')]: {
      marginTop: '10%',
    },
  },
  messageText: {
    ...theme.typography.waitingRoomHeading,
  },
}))

const SittingOut = ({ setUserEventStatus }) => {
  const classes = useStyles()

  const handleRejoinEventClick = () => {
    setUserEventStatus('waiting for match')
  }
  return (
    <div className={classes.waitingRoom}>
      <Typography className={classes.messageText}>
        You are sitting out of the event{' '}
        <span role="img" aria-label="sad face">
          😢
        </span>
      </Typography>
      <Typography className={classes.messageText}>
        Your name won&apos;t be thrown in the hat for the matching algorithm.
      </Typography>
      <Typography className={classes.messageText}>
        Whenever you&apos;re ready to join again, just hit the button below.
      </Typography>
      <Typography className={classes.messageText}>
        We can&apos;t wait until you&apos;re back in the event!
      </Typography>
      <Button variant="contained" size="large" color="primary" onClick={handleRejoinEventClick}>
        Rejoin Event
      </Button>
    </div>
  )
}

export default SittingOut
