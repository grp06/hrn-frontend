import React, { useState, useEffect } from 'react'

import Button from '@material-ui/core/Button'
import { useMutation } from 'react-apollo'

import { useGameContext } from '../context/useGameContext'
import { useStartRound, useCompleteRooms } from '../hooks'

const StartNextRound = () => {
  const [isDisconnectedAndComplete, setDisconnectedAndComplete] = useState(null)

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
