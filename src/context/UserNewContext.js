import React, { useEffect, createContext, useContext } from 'react'
import { useImmer } from 'use-immer'
import { useQuery } from '@apollo/react-hooks'
import { useHistory, useLocation } from 'react-router-dom'
import { useAppContext } from '.'
import { findUserNewById } from '../gql/queries'

const UserNewContext = createContext()

const defaultState = {
  userNew: {},
  userNewInEvent: false,
  userNewOnAuthRoute: false,
}

const useUserNewContext = () => {
  const [state, dispatch] = useContext(UserNewContext)

  if (dispatch === undefined) {
    throw new Error('Must have dispatch defined')
  }

  const resetUserNew = () => {
    dispatch((draft) => {
      draft.userNew = {
        name: '',
        userId: null,
        role: '',
        phone_number: '',
      }
    })
  }

  const setUserNewUpdatedAt = (updatedAt) => {
    dispatch((draft) => {
      draft.userNew.updated_at = updatedAt
    })
  }

  return {
    ...state,
    resetUserNew,
    setUserNewUpdatedAt,
  }
}

const UserNewProvider = ({ children }) => {
  const [state, dispatch] = useImmer({ ...defaultState })
  const { setAppLoading } = useAppContext()
  const history = useHistory()
  const location = useLocation()
  const { userId } = state.userNew
  const { pathname } = location

  const specificEventNewPageRegex = /\/events-new\/\d+[\/]?$/
  const eventsNewPageRegex = /\/events-new[\/]?$/
  const setNewPasswordPageRegex = /set-new-password/

  const userOnSpecificEventPage = Boolean(pathname.match(specificEventNewPageRegex))
  const userOnSetNewPasswordPage = Boolean(pathname.match(setNewPasswordPageRegex))
  const userOnSignUpPage = Boolean(pathname.includes('sign-up'))
  const userNewInEvent = Boolean(
    pathname.includes('video-room') ||
      pathname.includes('lobby') ||
      pathname.includes('group-video-chat')
  )
  const isUserOnAuth = Boolean(
    pathname === '/' ||
      pathname.includes('sign-up') ||
      pathname.includes('forgot-password') ||
      pathname.includes('set-new-password')
  )

  const { data: userNewData } = useQuery(findUserNewById, {
    variables: { id: userId },
    skip: !userId,
  })

  // Setting the user state in context after findUserById Query is made
  useEffect(() => {
    if (userNewData) {
      if (userNewData.users.length) {
        dispatch((draft) => {
          draft.userNew = userNewData.users[0]
          draft.userNewInEvent = userNewInEvent
        })
        return setAppLoading(false)
      }
    }
  }, [userNewData, userId])

  useEffect(() => {
    if (location) {
      console.log('i should be getting in here')
      console.log('isUserOnAuth ->', isUserOnAuth)
      console.log('userNewInEvent ->', userNewInEvent)
      dispatch((draft) => {
        draft.userNewOnAuthRoute = isUserOnAuth
        draft.userNewInEvent = userNewInEvent
      })
    }
  }, [location])

  // once we get on the app check to see if theres a userID in local storage
  // if there is then we want to set user.userId so that findByUserId query can be called
  // if not:
  // if we're on /events of /events/:id then do nothing
  // otherwise redirect back to /login
  useEffect(() => {
    const localStorageUserId = localStorage.getItem('userId')
    if (!localStorageUserId) {
      if (!(userOnSpecificEventPage || userOnSetNewPasswordPage || userOnSignUpPage)) {
        history.push('/')
      }
    } else {
      dispatch((draft) => {
        draft.userNew.id = parseInt(localStorageUserId, 10)
      })
    }
  }, [])

  return <UserNewContext.Provider value={[state, dispatch]}>{children}</UserNewContext.Provider>
}

export { useUserNewContext, UserNewProvider }
