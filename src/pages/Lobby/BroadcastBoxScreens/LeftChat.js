import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'

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

const LeftChat = () => {
  const classes = useStyles()
  return (
    <div className={classes.waitingRoom}>
      <Typography className={classes.messageText}>
        Sorry you had to leave the chat{' '}
        <span role="img" aria-label="really crying">
          😭
        </span>
      </Typography>
      <Typography className={classes.messageText}>
        We&apos;ve got our coder monkeys working hard to fix your issues.
      </Typography>
      <Typography className={classes.messageText}>
        We&apos;ve put your name back into the hat and we&apos;ll pair you with someone as soon as
        we can.
      </Typography>
    </div>
  )
}

export default LeftChat
