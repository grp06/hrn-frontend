import React, { useState, useEffect } from 'react'

import { useQuery } from '@apollo/react-hooks'
import { useImmer } from 'use-immer'

import { findMyUser } from '../gql/queries'

const GameContext = React.createContext()

const defaultState = {
  currentRound: 0,
  roomId: '',
  userId: null,
  role: '',
  partnerX: '',
  name: '',
  pairingsVariables: null,
  roundsData: null,
  myToken: '',
  appLoading: true,
}
const GameProvider = ({ children }) => {
  const [state, dispatch] = useImmer({ ...defaultState })

  const { data: userData } = useQuery(findMyUser, {
    variables: { id: state.userId },
    skip: !state.userId,
  })
  useEffect(() => {
    if (userData && userData.users.length) {
      const { name, role, id } = userData.users[0]

      dispatch((draft) => {
        draft.role = role
        draft.userId = id
        draft.name = name
        if (draft.userId) {
          draft.appLoading = false
        }
      })
    }
  }, [userData])

  useEffect(() => {
    if (!state.userId) {
      const myUserId = localStorage.getItem('userId')

      // Simulating when we have read users and make an API call
      setTimeout(() => {
        dispatch((draft) => {
          draft.userId = myUserId
          // we dont necessarily know which api call will return first
          if (draft.role) {
            draft.appLoading = false
          }
        })
      }, 1000)
    }
  }, [])

  return <GameContext.Provider value={[state, dispatch]}>{children}</GameContext.Provider>
}

export { GameProvider, GameContext }
