import { useContext } from 'react'

import { AppContext } from './AppProvider'

const useAppContext = () => {
  const [state, dispatch] = useContext(AppContext)

  if (dispatch === undefined) {
    throw new Error('Must have dispatch defined')
  }

  function resetUser() {
    dispatch((draft) => {
      draft.user = {
        name: '',
        userId: null,
        role: '',
        city: '',
        tags_users: [],
      }
    })
  }

  function setUsersTags(usersTags) {
    dispatch((draft) => {
      draft.user.tags_users = usersTags
    })
  }

  function setRedirect(redirect) {
    dispatch((draft) => {
      draft.app.redirect = redirect
    })
  }

  function setCameraAndMicPermissions(permissions) {
    dispatch((draft) => {
      draft.app.permissions = permissions
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

  function setHasPartnerAndIsConnecting(hasPartnerAndIsConnecting) {
    dispatch((draft) => {
      draft.twilio.hasPartnerAndIsConnecting = hasPartnerAndIsConnecting
    })
  }

  function updateUserObject(userObject) {
    dispatch((draft) => {
      draft.user.name = userObject.name
      draft.user.city = userObject.city
    })
  }

  return {
    ...state,
    resetUser,
    setRedirect,
    setUserId,
    setEventId,
    setPartnerDisconnected,
    setPartnerNeverConnected,
    setLateArrival,
    setHasPartnerAndIsConnecting,
    setCameraAndMicPermissions,
    setUsersTags,
    updateUserObject,
  }
}

export { useAppContext }
