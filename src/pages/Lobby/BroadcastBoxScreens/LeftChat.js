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
      <Typography className={classes.messageText}>
        In the meantime, press &apos;up&apos; on your keyboard to kill some time.
      </Typography>
      <div className={classes.trexContainer}>
        <ChromeDinoGame />
      </div>
    </div>
  )
}

export default LeftChat
