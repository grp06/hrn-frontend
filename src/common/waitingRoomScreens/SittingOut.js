import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  waitingRoom: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    background: '#111',
    height: '100vh',
    alignItems: 'center',
    flexDirection: 'column',
  },
  messageText: {
    ...theme.typography.waitingRoomHeading,
  },
  dancingMan: {
    fontSize: '50px',
  },
}))

const SittingOut = () => {
  const classes = useStyles()
  return (
    <div className={classes.waitingRoom}>
      <Typography className={classes.messageText}>
        Sometimes it happens that we have an odd number of people.
      </Typography>
      <Typography className={classes.messageText}>
        You&apos;ve been chosen to sit out this round. You'll be paired with someone new in 5
        minutes.
      </Typography>
      <Typography className={classes.messageText}>
        Get a drink of water. Stretch. Do a little dance.
      </Typography>
      <div className={classes.dancingMan}>
        <span>🕺</span>
      </div>
    </div>
  )
}

export default SittingOut
