import React from 'react'

import { useImmer } from 'use-immer'

const defaultState = {
  currentRound: 0,
  roomId: '',
  userId: '',
  isAdmin: false,
  partnerX: '',
  name: '',
  pairingsVariables: null,
  myToken: '',
}

const GameContext = React.createContext()

const GameProvider = ({ children }) => {
  const [state, dispatch] = useImmer({ ...defaultState })

  return <GameContext.Provider value={[state, dispatch]}>{children}</GameContext.Provider>
}

export { GameProvider, GameContext }
