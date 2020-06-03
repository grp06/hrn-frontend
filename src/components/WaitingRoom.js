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
    fontFamily: 'Muli',
    fontSize: 24,
    color: 'white',
    alignItems: 'center',
  },
}))

const WaitingRoom = () => {
  const classes = useStyles()
  const { waitingRoom } = useGameContext()
  if (waitingRoom) {
    return <div className={classes.waitingRoom}>Waiting between...</div>
  }
  return null
}
export default WaitingRoom
