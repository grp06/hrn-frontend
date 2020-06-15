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

const UserJoinedDuringRound = () => {
  const classes = useStyles()

  return (
    <div className={classes.waitingRoom}>
      <Typography className={classes.messageText}>
        Awh shucks, we just missed throwing your name into the hat for this round 🧢.
      </Typography>
      <Typography className={classes.messageText}>
        But don&apos;t worry! We&apos;ve penciled you in and you&apos;ll join the next round in a
        few minutes.
      </Typography>
      <Typography className={classes.messageText}>
        In the meantime, press 'up' on your keyboard to kill some time 😉.
      </Typography>
      <div className={classes.trexContainer}>
        <ChromeDinoGame />
      </div>
    </div>
  )
}

export default UserJoinedDuringRound
