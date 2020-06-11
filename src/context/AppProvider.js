import React, { useEffect } from 'react'

import { useQuery, useMutation } from '@apollo/react-hooks'
import { useImmer } from 'use-immer'

import { findUserById } from '../gql/queries'
import { updateLastSeen } from '../gql/mutations'
import { constants } from '../utils'

const { lastSeenDuration } = constants

const AppContext = React.createContext()

const defaultState = {
  user: {
    name: '',
    userId: null,
    role: '',
  },
  app: {
    redirect: null,
    appLoading: true,
  },
}
const AppProvider = ({ children }) => {
  const [state, dispatch] = useImmer({ ...defaultState })
  const { userId } = state.user

  const { data: userData, loading: userDataLoading, error: userDataError } = useQuery(
    findUserById,
    {
      variables: { id: userId },
      skip: !userId,
    }
  )

  const [updateLastSeenMutation] = useMutation(updateLastSeen, {
    variables: {
      now: new Date().toISOString(),
      id: userId,
    },
    skip: !userId,
  })

  // Setting lastSeen Mutation
  useEffect(() => {
    if (userId) {
      const interval = setInterval(async () => {
        try {
          await updateLastSeenMutation()
        } catch (error) {
          // sometimes theres an error here. Reloading "fixes" it  :|
          window.location.reload()
        }
      }, lastSeenDuration)
      return () => {
        clearInterval(interval)
      }
    }
  }, [userId])

  // Setting the user state in provider after findUserById Query is made
  useEffect(() => {
    if (userData && userData.users.length) {
      const { name, role, id } = userData.users[0]
      dispatch((draft) => {
        draft.role = role
        draft.userId = id
        draft.name = name
      })
    }
  }, [userData])

  // when user comes to page see if they have id in local storage
  // if not redirect back to login page
  useEffect(() => {
    if (!userId) {
      const myUserId = localStorage.getItem('userId')
      if (!myUserId && state.redirect === null) {
        return dispatch((draft) => {
          draft.redirect = true
          draft.appLoading = false
        })
      }
      dispatch((draft) => {
        draft.userId = myUserId
        draft.appLoading = false
      })
    }
  }, [])

  return <AppContext.Provider value={[state, dispatch]}>{children}</AppContext.Provider>
}

export { AppProvider }
