import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'
import ChromeDinoGame from 'react-chrome-dino'

const useStyles = makeStyles((theme) => ({
  waitingRoom: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    marginTop: '2%',
    [theme.breakpoints.down('md')]: {
      marginTop: '10%',
    },
  },
  messageText: {
    ...theme.typography.waitingRoomHeading,
  },
  trexContainer: {
    width: '100%',
    height: 'auto',
  },
}))

const SittingOut = () => {
  const classes = useStyles()
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
        Whenever you&apos;re ready to join again, just hit the toggle on the top right.
      </Typography>
      <Typography className={classes.messageText}>
        We can&apos;t wait until you&apos;re back in the event!
      </Typography>
      <Typography className={classes.messageText}>Enjoy this game to kill some time.</Typography>
      <div className={classes.trexContainer}>
        <ChromeDinoGame />
      </div>
    </div>
  )
}

export default SittingOut
