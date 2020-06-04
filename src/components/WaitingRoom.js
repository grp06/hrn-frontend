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
  const classes = useStyles()
  const { waitingRoom, myRound } = useGameContext()
  const hasPartner = myRound && myRound.partnerX_id && myRound.partnerY_id
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
        <span className={classes.largeText}>Hope you had a great chat!</span>
        <div className={classes.dancingMan}>
          <span>🕺</span>
        </div>
      </div>
    )
  }
  return null
}
export default WaitingRoom
