import React from 'react'

import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import { useGameContext } from '../context/useGameContext'
import { ThumbsUp } from '../common'

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

const WaitingRoom = () => {
  const classes = useStyles()
  const {
    waitingRoom,
    myRound,
    didPartnerDisconnect,
    userId,
    partnerNeverConnected,
  } = useGameContext()
  const hasPartner = myRound && myRound.partnerX_id && myRound.partnerY_id

  if (didPartnerDisconnect && hasPartner) {
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
  if (!hasPartner) {
    return (
      <div className={classes.waitingRoom}>
        <Typography className={classes.messageText}>
          Sometimes it happens that we have an odd number of people.
        </Typography>
        <Typography className={classes.messageText}>
          You&apos;ve been chosen to sit out this round.
        </Typography>
        <Typography className={classes.messageText}>
          Get a drink of water. Stretch. Do a little dance.
        </Typography>
        <div className={classes.dancingMan}>
          <span>🕺</span>
        </div>
      </div>
    )
  }
  if (partnerNeverConnected) {
    return (
      <div className={classes.waitingRoom}>
        <Typography className={classes.messageText}>
          It seems that your partner is having some camera issues.
        </Typography>
        <Typography className={classes.messageText}>
          Unfortunately you two will have to sit out this round. Sorry for disappointing 😔
        </Typography>
      </div>
    )
  }
  if (waitingRoom) {
    return (
      <div className={classes.waitingRoom}>
        <ThumbsUp myRound={myRound} userId={userId} />
      </div>
    )
  }
  return null
}
export default WaitingRoom
