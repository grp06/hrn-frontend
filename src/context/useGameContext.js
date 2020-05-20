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

  function setPartnerX(partnerX) {
    dispatch((draft) => {
      draft.partnerX = partnerX
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

  return {
    ...state,
    setUsers,
    setRoundsData,
    setToken,
    setPartnerX,
    setCurrentRound,
    setRoom,
    setLoading,
  }
}

export { useGameContext }
