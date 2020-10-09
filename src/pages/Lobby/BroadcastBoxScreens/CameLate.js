import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  waitingRoom: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    height: '90%',
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

const CameLate = () => {
  const classes = useStyles()

  return (
    <div className={classes.waitingRoom}>
      <Typography className={classes.messageText}>
        Awh shucks, we just missed throwing your name into the hat for this round{' '}
        <span role="img" aria-label="blue cap">
          🧢
        </span>
      </Typography>
      <Typography className={classes.messageText}>
        But don&apos;t worry! We&apos;ve penciled you in and we&apos;ll pair you with someone as
        soon as we can.
      </Typography>
    </div>
  )
}

export default CameLate
