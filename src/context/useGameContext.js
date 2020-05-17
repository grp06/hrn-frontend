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

  function setCurrentUserData({ isAdmin, name, id }) {
    dispatch((draft) => {
      debugger
      draft.isAdmin = isAdmin
      draft.userId = id
      draft.name = name
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

  function resetEvent() {
    dispatch((draft) => {
      draft.currentRound = 0
      draft.roundsData = []
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

  function setUserId(userId) {
    dispatch((draft) => {
      draft.userId = userId
    })
  }

  return {
    ...state,
    setCurrentUserData,
    setUsers,
    setRoundsData,
    resetEvent,
    setToken,
    setPartnerX,
    setCurrentRound,
    setUserId,
  }
}

export { useGameContext }
