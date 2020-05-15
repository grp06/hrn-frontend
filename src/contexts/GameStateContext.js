import React, { createContext, useState } from 'react'

import { useSubscription } from '@apollo/react-hooks'

import { getGameState } from '../gql/subscriptions'
// Create Context Object
export const GameStateContext = createContext()

// Create a provider for components to consume and subscribe to changes
export const GameStateContextProvider = ({ children }) => {
  const { data, loading } = useSubscription(getGameState)
  const [partnerX, setPartnerX] = useState(null)

  if (!data || !data.gameState.length || loading) {
    return null
  }

  return (
    <GameStateContext.Provider
      value={{
        currentRound: data.gameState[0].currentRound,
        gameOver: data.gameState[0].gameOver,
        setPartnerX,
        partnerX,
      }}
    >
      {children}
    </GameStateContext.Provider>
  )
}
