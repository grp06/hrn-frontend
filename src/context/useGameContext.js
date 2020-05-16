/* eslint-disable import/prefer-default-export */
import { useContext } from 'react'

import endpointUrl from '../utils/endpointUrl'
import { GameContext } from './provider'

const useGameContext = () => {
  const [state, dispatch] = useContext(GameContext)

  if (dispatch === undefined) {
    throw new Error('Must have dispatch defined')
  }

  function startRound() {
    dispatch((draft) => {})
  }

  function deleteRounds() {
    dispatch((draft) => {})
  }

  function setUsers(users) {
    dispatch((draft) => {
      draft.users = users
    })
  }

  function setCurrentUserData({ isAdmin, name, id }) {
    dispatch((draft) => {
      draft.isAdmin = isAdmin
      draft.userId = id
      draft.name = name
    })
  }

  function setAllRounds(data) {
    dispatch((draft) => {
      draft.allRounds = data
    })
  }
  function setCurrentRound(round) {
    dispatch((draft) => {
      draft.currentRound = round
    })
  }

  function resetEvent() {
    dispatch((draft) => {
      draft.currentRound = 0
      draft.allRounds = []
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

  return {
    ...state,
    startRound,
    deleteRounds,
    setCurrentUserData,
    setUsers,
    setAllRounds,
    setCurrentRound,
    resetEvent,
    setToken,
    setPartnerX,
  }
}

export { useGameContext }
