import { useContext } from 'react'

import { TwilioContext } from './TwilioProvider'

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

export default useTwilioContext
