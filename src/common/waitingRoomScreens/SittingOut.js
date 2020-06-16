import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'
import ChromeDinoGame from 'react-chrome-dino'

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
  trexContainer: {
    width: '80vw',
    height: 'auto',
  },
}))

const SittingOut = () => {
  const classes = useStyles()
  return (
    <div className={classes.waitingRoom}>
      <Typography className={classes.messageText}>You are the chosen one 👑 !</Typography>
      <Typography className={classes.messageText}>
        Sometimes we have an odd number of people and need someone to sit out.
      </Typography>
      <Typography className={classes.messageText}>
        But no worries, you'll be paired with someone new in 5 minutes.
      </Typography>
      <Typography className={classes.messageText}>
        Get a drink of water. Stretch. Do a little dance 🕺.
      </Typography>
      <Typography className={classes.messageText}>
        Or press 'up' on your keyboard to kill some time.
      </Typography>
      <div className={classes.trexContainer}>
        <ChromeDinoGame />
      </div>
    </div>
  )
}

export default SittingOut
