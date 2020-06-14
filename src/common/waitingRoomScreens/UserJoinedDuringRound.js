import React, { useRef, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'
import { TRexGame } from '..'

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
  tRexGameContainer: {
    width: '100vw',
    height: '50vh',
  },
}))

const UserJoinedDuringRound = () => {
  const classes = useStyles()
  const tRexDiv = useRef()

  console.log('tRexDiv ->', tRexDiv)
  return (
    <div className={classes.waitingRoom}>
      <Typography className={classes.messageText}>
        Awh shucks, you just missed throwing your name into the hat for this round 🧢.
      </Typography>
      <Typography className={classes.messageText}>
        But don't worry! We've penciled you in and you'll join the next round in a few minutes.
      </Typography>
      <div className={classes.tRexGameContainer} ref={tRexDiv}>
        <TRexGame outerContainerEl={tRexDiv} />
      </div>
    </div>
  )
}

export default UserJoinedDuringRound
