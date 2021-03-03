import React, { useEffect, createContext, useContext } from 'react'
import { useImmer } from 'use-immer'
import { useQuery } from '@apollo/react-hooks'
import { useHistory, useLocation } from 'react-router-dom'
import { findUserById } from '../gql/queries'

const UserContext = createContext()

const defaultState = {
  user: {},
  userInEvent: false,
  userOnAuthRoute: false,
  userContextLoading: true,
}

const useUserContext = () => {
  const [state, dispatch] = useContext(UserContext)

  if (dispatch === undefined) {
    throw new Error('Must have dispatch defined')
  }

  const resetUser = () => {
    dispatch((draft) => {
      draft.user = {
        name: '',
        userId: null,
        role: '',
        city: '',
        shortBio: '',
        linkedIn_url: '',
        tags_users: [],
      }
    })
  }

  const setUsersTags = (usersTags) => {
    dispatch((draft) => {
      draft.user.tags_users = usersTags
    })
  }

  const setUserUpdatedAt = (updatedAt) => {
    dispatch((draft) => {
      draft.user.updated_at = updatedAt
    })
  }

  const setUserInEvent = (boolean) => {
    dispatch((draft) => {
      draft.userInEvent = boolean
    })
  }

  const setUserContextLoading = (boolean) => {
    dispatch((draft) => {
      draft.userContextLoading = boolean
    })
  }

  const updateUserObject = (userObject) => {
    dispatch((draft) => {
      draft.user.name = userObject.name
      draft.user.city = userObject.city
      draft.user.short_bio = userObject.short_bio
      draft.user.linkedIn_url = userObject.linkedIn_url
    })
  }

  return {
    ...state,
    resetUser,
    setUsersTags,
    setUserUpdatedAt,
    updateUserObject,
    setUserInEvent,
    setUserContextLoading,
  }
}

const UserProvider = ({ children }) => {
  const [state, dispatch] = useImmer({ ...defaultState })
  const history = useHistory()
  const location = useLocation()
  const { userId } = state.user
  const { pathname } = location

  const specificEventPageRegex = /\/events\/\d+[\/]?$/
  const eventsPageRegex = /\/events[\/]?$/
  const setNewPasswordPageRegex = /set-new-password/

  const userOnSpecificEventPage = Boolean(pathname.match(specificEventPageRegex))
  const userOnEventsPage = Boolean(pathname.match(eventsPageRegex))
  const userOnSetNewPasswordPage = Boolean(pathname.match(setNewPasswordPageRegex))
  const userOnSignUpPage = Boolean(pathname.includes('sign-up'))
  const userOnSubscriptionPage = Boolean(pathname.includes('/subscription'))
  const userInEvent = Boolean(
    pathname.includes('video-room') ||
      pathname.includes('lobby') ||
      pathname.includes('group-video-chat')
  )
  const isUserOnAuth = Boolean(
    pathname === '/' ||
      pathname.includes('sign-up') ||
      pathname.includes('forgot-password') ||
      pathname.includes('set-new-password') ||
      pathname.includes('onboarding') ||
      pathname.includes('host-onboarding') ||
      pathname.includes('checkout-success')
  )

  const { data: userData } = useQuery(findUserById, {
    variables: { id: userId },
    skip: !userId,
  })

  // Setting the user state in context after findUserById Query is made
  useEffect(() => {
    if (userData) {
      if (userData.users.length) {
        dispatch((draft) => {
          draft.user = userData.users[0]
          draft.userInEvent = userInEvent
          draft.userContextLoading = false
        })
      }
    }
  }, [userData, userId])

  useEffect(() => {
    if (location) {
      dispatch((draft) => {
        draft.userOnAuthRoute = isUserOnAuth
        draft.userInEvent = userInEvent
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
      if (
        !(
          userOnEventsPage ||
          userOnSpecificEventPage ||
          userOnSetNewPasswordPage ||
          userOnSignUpPage ||
          userOnSubscriptionPage
        )
      ) {
        return history.push('/')
      }
      console.log('set user context false')
      dispatch((draft) => {
        draft.userContextLoading = false
      })
    } else {
      console.log('setting user id')
      dispatch((draft) => {
        draft.user.userId = parseInt(localStorageUserId, 10)
      })
    }
  }, [])

  return <UserContext.Provider value={[state, dispatch]}>{children}</UserContext.Provider>
}

export { useUserContext, UserProvider }
