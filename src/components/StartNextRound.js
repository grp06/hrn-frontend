import React, { useState, useEffect } from 'react'

import Button from '@material-ui/core/Button'
import { useMutation } from 'react-apollo'

import { useGameContext } from '../context/useGameContext'
import { useStartRound, useCompleteAndCreateRooms } from '../hooks'

const StartNextRound = () => {
  const [isDisconnectedAndComplete, setDisconnectedAndComplete] = useState(null)

  const { currentRound } = useGameContext()
  const { completeAndCreateRooms } = useCompleteAndCreateRooms()

  if (currentRound === 0) {
    return null
  }

  return (
    <Button variant="outlined" onClick={completeAndCreateRooms}>
      Start Next Round
    </Button>
  )
}

export default StartNextRound
