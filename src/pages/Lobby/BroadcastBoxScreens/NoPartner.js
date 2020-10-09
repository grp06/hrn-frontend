import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'

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
  dancingMan: {
    fontSize: '50px',
  },
}))

const NoPartner = () => {
  const classes = useStyles()
  return (
    <div className={classes.waitingRoom}>
      <Typography className={classes.messageText}>
        You are the chosen one{' '}
        <span role="img" aria-label="crown">
          👑
        </span>
      </Typography>
      <Typography className={classes.messageText}>
        Sometimes we have an odd number of people and need someone to sit out.
      </Typography>
      <Typography className={classes.messageText}>
        But no worries, we&apos;ll pair you with someone as soon as we can.
      </Typography>
      <Typography className={classes.messageText}>
        Get a drink of water. Stretch. Do a little dance{' '}
        <span role="img" aria-label="dancing man">
          🕺
        </span>
        .
      </Typography>
    </div>
  )
}

export default NoPartner
