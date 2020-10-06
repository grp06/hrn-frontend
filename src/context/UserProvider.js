import React, { useEffect } from 'react'
import { useImmer } from 'use-immer'
import { useQuery } from '@apollo/react-hooks'
import { useHistory } from 'react-router-dom'
import { useAppContext } from '.'
import { findUserById } from '../gql/queries'

const UserContext = React.createContext()

const defaultState = {
  user: {},
}

const UserProvider = ({ children }) => {
  const [state, dispatch] = useImmer({ ...defaultState })
  const { setAppLoading } = useAppContext()
  const history = useHistory()
  const { userId } = state.user
  const specificEventPageRegex = /\/events\/\d+[\/]?$/
  const eventsPageRegex = /\/events[\/]?$/
  const setNewPasswordPageRegex = /set-new-password/
  const userOnSpecificEventPage = Boolean(window.location.pathname.match(specificEventPageRegex))
  const userOnEventsPage = Boolean(window.location.pathname.match(eventsPageRegex))
  const userOnSetNewPasswordPage = Boolean(window.location.pathname.match(setNewPasswordPageRegex))

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
        })
        return setAppLoading(false)
      }
    }
  }, [userData, userId])

  // once we get on the app check to see if theres a userID in local storage
  // if there is then we want to set user.userId so that findByUserId query can be called
  // if not:
  // if we're on /events of /events/:id then do nothing
  // otherwise redirect back to /login
  useEffect(() => {
    const localStorageUserId = localStorage.getItem('userId')
    if (!localStorageUserId) {
      if (!(userOnEventsPage || userOnSpecificEventPage || userOnSetNewPasswordPage)) {
        history.push('/')
      }
    } else {
      dispatch((draft) => {
        draft.user.userId = parseInt(localStorageUserId, 10)
      })
    }
  }, [])

  return <UserContext.Provider value={[state, dispatch]}>{children}</UserContext.Provider>
}

export { UserProvider, UserContext }
