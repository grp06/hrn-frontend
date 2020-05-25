import React from 'react'

import Button from '@material-ui/core/Button'

import { useGameContext } from '../context/useGameContext'
import { useCompleteRooms } from '../hooks'

const StartNextRound = () => {
  const { currentRound } = useGameContext()
  const { completeRooms } = useCompleteRooms()

  if (currentRound === 0) {
    return null
  }

  return (
    <Button variant="outlined" onClick={completeRooms}>
      Start Next Round
    </Button>
  )
}

export default StartNextRound
