import { useContext } from 'react'

import { GameContext } from './provider'

const useGameContext = () => {
  const [state, dispatch] = useContext(GameContext)

  if (dispatch === undefined) {
    throw new Error('Must have dispatch defined')
  }

  function setAttendees(attendees) {
    console.log('setAttendees -> attendees', attendees)
    dispatch((draft) => {
      draft.attendees = attendees
    })
  }

  function setWaitingRoom(waitingRoom, partnerNeverConnected) {
    dispatch((draft) => {
      draft.waitingRoom = waitingRoom
      if (waitingRoom) {
        draft.token = null
        draft.roomId = null
        draft.room = null
      }
    })
  }

  function setRoundsData(rounds) {
    console.log('setRoundsData -> rounds', rounds)
    dispatch((draft) => {
      draft.roundsData = rounds
    })
  }

  function setRoom(room) {
    console.log('setRoom -> room', room)
    dispatch((draft) => {
      draft.room = room
    })
  }

  function setLoading(loading) {
    console.log('setLoading -> loading', loading)
    dispatch((draft) => {
      draft.loading = loading
    })
  }

  function setRedirect(redirect) {
    console.log('setRedirect -> redirect', redirect)
    dispatch((draft) => {
      draft.redirect = redirect
    })
  }

  function setEventId(eventId) {
    console.log('setEventId -> eventId', eventId)
    dispatch((draft) => {
      draft.eventId = eventId
    })
  }

  function setUserId(userId) {
    console.log('setUserId -> userId', userId)
    dispatch((draft) => {
      draft.userId = userId
    })
  }

  // only used once - in Header.js
  function setCurrentRound(currentRound) {
    console.log('setCurrentRound -> currentRound', currentRound)
    dispatch((draft) => {
      draft.currentRound = currentRound
    })
  }

  function setDidPartnerDisconnect(partnerDisconnect) {
    console.log('setDidPartnerDisconnect -> didPartnerDisconnect')
    dispatch((draft) => {
      draft.didPartnerDisconnect = partnerDisconnect
    })
  }

  function setPartnerNeverConnected(partnerConnected) {
    console.log('setPartnerNeverConnected -> partnerNeverConnected')
    dispatch((draft) => {
      draft.partnerNeverConnected = partnerConnected
    })
  }

  return {
    ...state,
    setRoundsData,
    setLoading,
    setRedirect,
    setEventId,
    setRoom,
    setUserId,
    setAttendees,
    setCurrentRound,
    setWaitingRoom,
    setDidPartnerDisconnect,
    setPartnerNeverConnected,
  }
}

export { useGameContext }
