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

  function getUserId() {
    dispatch((draft) => {
      draft.userId = parseInt(localStorage.getItem('userID'), 10)
    })
  }

  function setToken() {
    dispatch((draft) => {
      const { partnerX, userId } = draft
      fetch(`${endpointUrl}/give-me-a-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ partnerX, userId }),
      })
        .then((res) => res.json())
        .then(({ token }) => {
          console.log('my token -= ', token)
          draft.token = token
        })
    })
  }

  function deleteRounds() {
    dispatch((draft) => {})
  }

  function setUsers(users) {
    dispatch((draft) => {
      draft.users = users
    })
  }

  function setCurrentUserData({ isAdmin, name }) {
    dispatch((draft) => {
      draft.isAdmin = isAdmin

      draft.name = name
      console.log('namemeeee = ', name)
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

  return {
    ...state,
    startRound,
    getUserId,
    setToken,
    deleteRounds,
    setCurrentUserData,
    setUsers,
    setAllRounds,
    setCurrentRound,
    resetEvent,
  }
}

export { useGameContext }
