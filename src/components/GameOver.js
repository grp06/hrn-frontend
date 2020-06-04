import React from 'react'

import { makeStyles } from '@material-ui/core/styles'

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

const GameOver = () => {
  const classes = useStyles()

  return <div className={classes.connecting}>Thanks for joining us!</div>
}
export default GameOver
