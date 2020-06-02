import React from 'react'

import { makeStyles } from '@material-ui/core/styles'

import { useGameContext } from '../context/useGameContext'

const useStyles = makeStyles((theme) => ({
  connecting: {
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

const Connecting = () => {
  const classes = useStyles()
  const { twilioReady, connecting, waitingRoom } = useGameContext()
  if (waitingRoom) {
    return <div className={classes.connecting}>Waiting between rounds...</div>
  }
  if (twilioReady && !connecting) {
    return null
  }
  return <div className={classes.connecting}>Connecting you to someone awesome...</div>
}
export default Connecting
