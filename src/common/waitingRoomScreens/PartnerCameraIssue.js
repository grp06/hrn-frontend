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

const PartnerCameraIssue = () => {
  const classes = useStyles()
  return (
    <div className={classes.waitingRoom}>
      <Typography className={classes.messageText}>
        It seems that your partner is having some technical issues.
      </Typography>
      <Typography className={classes.messageText}>
        Unfortunately you two will have to sit out this round. Sorry for disappointing 😔
      </Typography>
    </div>
  )
}

export default PartnerCameraIssue
