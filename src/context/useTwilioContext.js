import { useContext } from 'react'

import { TwilioContext } from './TwilioProvider'

const useTwilioContext = () => {
  const [state, dispatch] = useContext(TwilioContext)

  if (dispatch === undefined) {
    throw new Error('Must have dispatch defined')
  }

  const setPartnerDisconnected = (partnerDisconnected) => {
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

  return {
    ...state,
    setPartnerDisconnected,
    setPartnerNeverConnected,
    setHasPartnerAndIsConnecting,
  }
}

export default useTwilioContext
