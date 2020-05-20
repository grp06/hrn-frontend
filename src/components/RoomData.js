import React, { useState, useEffect } from 'react'

import { useSubscription } from '@apollo/react-hooks'
import Card from '@material-ui/core/Card'
import { makeStyles } from '@material-ui/styles'

import { useGameContext } from '../context/useGameContext'

const useStyles = makeStyles((theme) => ({
  roomDataWrapper: {
    width: 300,
    position: 'fixed',
    top: 84,
    right: 20,
    height: 600,
    padding: 10,
  },
}))

const RoomData = () => {
  const classes = useStyles()
  const { room } = useGameContext()

  return <Card className={classes.roomDataWrapper}>display room data here</Card>
}

export default RoomData
