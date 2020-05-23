import React, { useState, useEffect } from 'react'

import Button from '@material-ui/core/Button'
import { useMutation } from 'react-apollo'

import { useGameContext } from '../context/useGameContext'
import { useStartRound, useCompleteAndCreateRooms } from '../hooks'

const StartNextRound = () => {
  const [isDisconnectedAndComplete, setDisconnectedAndComplete] = useState(null)

  const { currentRound, roundsData } = useGameContext()
  const { startRound } = useStartRound()
  const { completeAndCreateRooms } = useCompleteAndCreateRooms()

  useEffect(() => {
    if (isDisconnectedAndComplete) {
      startRound(roundsData)
    }
  }, [isDisconnectedAndComplete])

  if (currentRound === 0) {
    return null
  }

  const nextRound = async () => {
    const res = await completeAndCreateRooms()
    console.log('hi ', res)

    // startRound(roundsData.rounds) at the end
  }

  return (
    <Button variant="outlined" onClick={nextRound}>
      Start Next Round
    </Button>
  )
}

export default StartNextRound
