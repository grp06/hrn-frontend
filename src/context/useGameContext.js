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

  function setRoundsData(rounds) {
    dispatch((draft) => {
      draft.roundsData = rounds
    })
  }

  function setCurrentRound(currentRound) {
    dispatch((draft) => {
      draft.currentRound = currentRound
    })
  }

  function setToken(token) {
    dispatch((draft) => {
      draft.token = token
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

  return {
    ...state,
    setUsers,
    setRoundsData,
    setToken,
    setRoomId,
    setCurrentRound,
    setRoom,
    setLoading,
    setRedirect,
    setEventId,
  }
}

export { useGameContext }
