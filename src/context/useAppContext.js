import { useContext } from 'react'

import { AppContext } from './AppProvider'

const useAppContext = () => {
  const [state, dispatch] = useContext(AppContext)

  if (dispatch === undefined) {
    throw new Error('Must have dispatch defined')
  }

  function setRedirect(redirect) {
    dispatch((draft) => {
      draft.app.redirect = redirect
    })
  }

  function setUserId(userId) {
    dispatch((draft) => {
      draft.user.userId = userId
    })
  }

  function setEventId(eventId) {
    dispatch((draft) => {
      draft.event.eventId = eventId
    })
  }

  function setPartnerDisconnected(partnerDisconnected) {
    dispatch((draft) => {
      draft.twilio.partnerDisconnected = partnerDisconnected
    })
  }

  function setPartnerNeverConnected(partnerNeverConnected) {
    dispatch((draft) => {
      draft.twilio.partnerNeverConnected = partnerNeverConnected
    })
  }

  function setLateArrival(lateArrival) {
    dispatch((draft) => {
      draft.twilio.lateArrival = lateArrival
    })
  }

  return {
    ...state,
    setRedirect,
    setUserId,
    setEventId,
    setPartnerDisconnected,
    setPartnerNeverConnected,
    setLateArrival,
  }
}

export { useAppContext }
