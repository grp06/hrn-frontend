import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'
import ChromeDinoGame from 'react-chrome-dino'

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
  trexContainer: {
    width: '80vw',
    height: 'auto',
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
      <Typography className={classes.messageText}>
        In the meantime, press &apos;up&apos; on your keyboard to kill some time.
      </Typography>
      <div className={classes.trexContainer}>
        <ChromeDinoGame />
      </div>
    </div>
  )
}

export default WaitingForMatch
