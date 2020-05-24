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

  function setGameData(roundsData, currentRound, eventId) {
    dispatch((draft) => {
      draft.roundsData = roundsData
      draft.currentRound = currentRound
      draft.eventId = eventId
    })
  }

  function setCurrentRound(currentRound) {
    dispatch((draft) => {
      draft.currentRound = currentRound
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
    setCurrentRound,
    setLoading,
    setRedirect,
    setEventId,
    setRoomId,
    setGameData,
  }
}

export { useGameContext }
