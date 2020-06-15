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
      <Typography className={classes.messageText}>
        Sometimes there are an odd number of people. You&apos;ve been chosen to sit out this round.
      </Typography>
      <Typography className={classes.messageText}>
        You&apos;ll be paired with someone new within 5 minutes. In the meantime, press space bar
        for a surprise 😉
      </Typography>

      <div className={classes.trexContainer}>
        <ChromeDinoGame />
      </div>
    </div>
  )
}

export default SittingOut
