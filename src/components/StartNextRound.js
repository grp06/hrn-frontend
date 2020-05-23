import React from 'react'

import Button from '@material-ui/core/Button'
import { useMutation } from 'react-apollo'

import { useGameContext } from '../context/useGameContext'
import { useStartRound } from '../hooks'

const StartNextRound = () => {
  const { currentRound, roundsData } = useGameContext()
  const { startRound } = useStartRound()

  if (currentRound === 0) {
    return null
  }

  return (
    <Button variant="outlined" onClick={startRound}>
      Start Next Round
    </Button>
  )
}

export default StartNextRound
