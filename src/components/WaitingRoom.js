import React from 'react'

import { makeStyles } from '@material-ui/core/styles'

import { useGameContext } from '../context/useGameContext'

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
  largeText: {
    fontFamily: 'Muli',
    fontSize: 24,
    color: 'white',
    width: '50%',
    textAlign: 'center',
    lineHeight: '2rem',
  },
  dancingMan: {
    fontSize: 50,
    marginTop: 50,
  },
}))

const WaitingRoom = () => {
  console.log('calling waiting Room')
  const classes = useStyles()
  const { waitingRoom, myRound, didPartnerDisconnect } = useGameContext()
  const hasPartner = myRound && myRound.partnerX_id && myRound.partnerY_id
  if (didPartnerDisconnect && hasPartner) {
    return (
      <div className={classes.waitingRoom}>
        <span className={classes.largeText}>
          Sorry to break the bad news to you, but your partner disconnected ... something to do with
          squirrels chewing their router 🤷‍♀️. Stay put and we will connect you with someone soon!
        </span>
      </div>
    )
  }
  if (!hasPartner) {
    return (
      <div className={classes.waitingRoom}>
        <span className={classes.largeText}>
          Sometimes it happens that we have an odd number of people. You&apos;ve been chosen to sit
          out this round. Get a drink of water. Stretch. Do a little dance.
        </span>
        <div className={classes.dancingMan}>
          <span>🕺</span>
        </div>
      </div>
    )
  }
  if (waitingRoom) {
    return (
      <div className={classes.waitingRoom}>
        <span className={classes.largeText}>
          Hope you had a great chat! Finding another awesome person for you to connect with
        </span>
        <div className={classes.dancingMan}>
          <span>🕺</span>
        </div>
      </div>
    )
  }
  return null
}
export default WaitingRoom
