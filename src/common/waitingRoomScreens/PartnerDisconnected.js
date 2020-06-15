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

const PartnerDisconnected = () => {
  const classes = useStyles()
  return (
    <div className={classes.waitingRoom}>
      <Typography className={classes.messageText}>
        Sorry to break the bad news to you, but your partner disconnected ... something to do with
        squirrels chewing their router 🤷‍♀️.
      </Typography>
      <Typography className={classes.messageText}>
        Stay put and we will connect you with someone soon!
      </Typography>
    </div>
  )
}

export default PartnerDisconnected
