import React, { createContext, useState } from 'react'

import { useImmer } from 'use-immer'

const defaultState = {
  currentRound: 0,
  roomId: '',
  userId: '',
  isAdmin: false,
  allPairings: [],
  partnerX: '',
  partnerY: null,
  users: null,
  currentUserData: null,
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
