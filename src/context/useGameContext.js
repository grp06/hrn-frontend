import { useContext } from 'react'

import { GameContext } from './provider'

const useGameContext = () => {
  const [state, dispatch] = useContext(GameContext)

  if (dispatch === undefined) {
    throw new Error('Must have dispatch defined')
  }

  function setUsers(users) {
    dispatch((draft) => {
      draft.users = users
    })
  }

  function setToken(token) {
    dispatch((draft) => {
      draft.token = token
    })
  }

  function setTwilioReady(twilioReady) {
    dispatch((draft) => {
      draft.twilioReady = twilioReady
    })
  }

  function setLocalVideoTrack(localVideoTrack) {
    dispatch((draft) => {
      draft.localVideoTrack = localVideoTrack
    })
  }

  function setRoundsData(rounds) {
    dispatch((draft) => {
      draft.roundsData = rounds
    })
  }

  function setGameData(roundsData, currentRound, eventId) {
    dispatch((draft) => {
      draft.roundsData = roundsData
      draft.currentRound = currentRound
      draft.eventId = eventId
      // reset all these guys between rounds
      draft.roomId = null
      draft.room = null
      draft.token = null
      draft.twilioReady = false
    })
  }

  function setEventId(id) {
    dispatch((draft) => {
      draft.eventId = id
    })
  }

  function setRoomId(roomId) {
    dispatch((draft) => {
      draft.roomId = roomId
    })
  }

  function setRoom(room) {
    dispatch((draft) => {
      draft.room = room
    })
  }

  function setLoading(loading) {
    dispatch((draft) => {
      draft.loading = loading
    })
  }

  function setRedirect(redirect) {
    dispatch((draft) => {
      draft.redirect = redirect
    })
  }

  function resetUserState() {
    dispatch((draft) => {
      draft.token = null
      draft.roomId = null
      draft.localVideoTrack = null
      draft.room = null
      draft.twilioReady = false
    })
  }

  return {
    ...state,
    setUsers,
    setRoundsData,
    setLoading,
    setRedirect,
    setEventId,
    setRoomId,
    setGameData,
    setToken,
    setTwilioReady,
    setLocalVideoTrack,
    setRoom,
    resetUserState,
  }
}

export { useGameContext }
