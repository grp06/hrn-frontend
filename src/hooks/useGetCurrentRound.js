import React from 'react'

import { useSubscription } from '@apollo/react-hooks'

import { useGameContext } from '../context/useGameContext'
import { getCurrentRound } from '../gql/subscriptions'

const useGameState = () => {
  const { setCurrentRound, roundsData } = useGameContext()
  const { loading, error, data } = useSubscription(getCurrentRound)
  if (loading) {
    return <div>loading rounds data...</div>
  }
  if (error) {
    return <div>error from game state</div>
  }

  if (data && roundsData) {
    setCurrentRound(data.gameState[0].currentRound)
  }
  return null
}

export default useGameState
