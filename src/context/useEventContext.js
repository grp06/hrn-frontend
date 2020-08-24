import { useContext } from 'react'

import { EventContext } from './EventProvider'

const useEventContext = () => {
  const [state, dispatch] = useContext(EventContext)

  if (dispatch === undefined) {
    throw new Error('Must have dispatch defined')
  }

  const resetEvent = () => {
    dispatch((draft) => {
      draft.event = {}
    })
  }

  const setCameraAndMicPermissions = (permissions) => {
    dispatch((draft) => {
      draft.app.permissions = permissions
    })
  }

  // LETS TRY TO GET RID OF THIS
  const setEventId = (eventId) => {
    dispatch((draft) => {
      draft.eventId = eventId
    })
  }

  // LETS TRY TO GET RID OF THIS
  const setPartnerDisconnected = (partnerDisconnected) => {
    dispatch((draft) => {
      draft.twilio.partnerDisconnected = partnerDisconnected
    })
  }

  // LETS TRY TO GET RID OF THIS
  const setPartnerNeverConnected = (partnerNeverConnected) => {
    dispatch((draft) => {
      draft.twilio.partnerNeverConnected = partnerNeverConnected
    })
  }

  // LETS TRY TO GET RID OF THIS
  const setHasPartnerAndIsConnecting = (hasPartnerAndIsConnecting) => {
    dispatch((draft) => {
      draft.twilio.hasPartnerAndIsConnecting = hasPartnerAndIsConnecting
    })
  }

  return {
    ...state,
    resetEvent,
    setCameraAndMicPermissions,
    setEventId,
    setPartnerDisconnected,
    setPartnerNeverConnected,
    setHasPartnerAndIsConnecting,
  }
}

export default useEventContext
