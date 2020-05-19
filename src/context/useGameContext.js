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

  function setUserId(userId) {
    dispatch((draft) => {
      draft.userId = userId
    })
  }

  function setCurrentUserData({ role, name, id }) {
    dispatch((draft) => {
      draft.role = role
      draft.userId = id
      draft.name = name
    })
  }

  return {
    ...state,
    setCurrentUserData,
    setUsers,
    setRoundsData,
    setToken,
    setPartnerX,
    setCurrentRound,
    setUserId,
  }
}

export { useGameContext }
