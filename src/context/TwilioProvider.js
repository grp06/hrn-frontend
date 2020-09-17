import React from 'react'

import { useImmer } from 'use-immer'

const TwilioContext = React.createContext()

const defaultState = {
  partnerDisconnected: false,
  partnerNeverConnected: false,
  hasPartnerAndIsConnecting: false,
}

const TwilioProvider = ({ children }) => {
  const [state, dispatch] = useImmer({ ...defaultState })

  return <TwilioContext.Provider value={[state, dispatch]}>{children}</TwilioContext.Provider>
}

export { TwilioProvider, TwilioContext }
