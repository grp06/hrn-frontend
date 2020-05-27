import React, { useState, useEffect } from 'react'

import { useQuery } from '@apollo/react-hooks'
import { Redirect } from 'react-router-dom'
import { useImmer } from 'use-immer'

import { findMyUser } from '../gql/queries'

const GameContext = React.createContext()

const defaultState = {
  appLoading: true,
  currentRound: 0,
  eventId: null,
  myRound: null,
  name: '',
  roundsData: null,
  redirect: null,
  role: '',
  roomId: null,
  token: null,
  twilioReady: false,
  userId: null,
  users: null,
}
const GameProvider = ({ children, location }) => {
  const [state, dispatch] = useImmer({ ...defaultState })
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
      setTimeout(() => {
        dispatch((draft) => {
          draft.userId = myUserId
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
