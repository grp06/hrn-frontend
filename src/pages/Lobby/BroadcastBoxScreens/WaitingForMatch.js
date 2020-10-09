import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  waitingRoom: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    height: '100vh',
    alignItems: 'center',
    flexDirection: 'column',
    marginTop: '2%',
    [theme.breakpoints.down('md')]: {
      marginTop: '5%',
    },
  },
  messageText: {
    ...theme.typography.waitingRoomHeading,
  },
}))

const WaitingForMatch = () => {
  const classes = useStyles()

  return (
    <div className={classes.waitingRoom}>
      <Typography className={classes.messageText}>
        Glad to have you back{' '}
        <span role="img" aria-label="hugging hands">
          🤗
        </span>
      </Typography>
      <Typography className={classes.messageText}>
        We&apos;ve penciled you in and we&apos;ll pair you with someone as soon as we can.
      </Typography>
    </div>
  )
}

export default WaitingForMatch
