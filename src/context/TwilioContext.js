import React, { createContext, useContext } from 'react'

import { useImmer } from 'use-immer'

const TwilioContext = createContext()

const defaultState = {
  partnerDisconnected: false,
  partnerNeverConnected: false,
  hasPartnerAndIsConnecting: false,
  myRound: null,
}

const useTwilioContext = () => {
  const [state, dispatch] = useContext(TwilioContext)

  if (dispatch === undefined) {
    throw new Error('Must have dispatch defined')
  }

  const setPartnerDisconnected = (partnerDisconnected) => {
    console.log('setPartnerDisconnected ->', partnerDisconnected)
    dispatch((draft) => {
      draft.partnerDisconnected = partnerDisconnected
    })
  }

  const setPartnerNeverConnected = (partnerNeverConnected) => {
    dispatch((draft) => {
      draft.partnerNeverConnected = partnerNeverConnected
    })
  }

  const setHasPartnerAndIsConnecting = (hasPartnerAndIsConnecting) => {
    dispatch((draft) => {
      draft.hasPartnerAndIsConnecting = hasPartnerAndIsConnecting
    })
  }

  const setMyRound = (myRound) => {
    dispatch((draft) => {
      draft.myRound = myRound
    })
  }

  return {
    ...state,
    setPartnerDisconnected,
    setPartnerNeverConnected,
    setHasPartnerAndIsConnecting,
    setMyRound,
  }
}

const TwilioProvider = ({ children }) => {
  const [state, dispatch] = useImmer({ ...defaultState })

  return <TwilioContext.Provider value={[state, dispatch]}>{children}</TwilioContext.Provider>
}

export { useTwilioContext, TwilioProvider }
