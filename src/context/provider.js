import React, { useState, useEffect } from 'react'

import { useQuery } from '@apollo/react-hooks'
import { Redirect } from 'react-router-dom'
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
  redirect: null,
}
const GameProvider = ({ children, location }) => {
  const [state, dispatch] = useImmer({ ...defaultState })
  console.log('state.userId = ', state.userId)
  const { data: userData } = useQuery(findMyUser, {
    variables: { id: state.userId },
    skip: !state.userId || !state.appLoading,
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
      if (!myUserId && state.redirect === null) {
        return dispatch((draft) => {
          draft.redirect = true
          draft.appLoading = false
        })
      }
      // Simulating when we have read users and make an API call
      setTimeout(() => {
        dispatch((draft) => {
          draft.userId = myUserId
          // we dont necessarily know which api call will return first
          if (draft.role) {
            draft.appLoading = false
          }
        })
      }, 500)
    }
  }, [])

  if (state.redirect && location.pathname !== '/') {
    return <Redirect to="/" push />
  }

  return <GameContext.Provider value={[state, dispatch]}>{children}</GameContext.Provider>
}

export { GameProvider, GameContext }
