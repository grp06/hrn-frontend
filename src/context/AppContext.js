import React, { createContext, useContext } from 'react'
import { useImmer } from 'use-immer'

const AppContext = createContext()

const defaultState = {
  redirect: null,
  appLoading: false,
}

const useAppContext = () => {
  const [state, dispatch] = useContext(AppContext)

  if (dispatch === undefined) {
    throw new Error('Must have dispatch defined')
  }

  const setAppLoading = (loading) => {
    console.log('🚀 ~ setAppLoading ~ loading', loading)
    dispatch((draft) => {
      draft.appLoading = loading
    })
  }

  const setRedirect = (redirect) => {
    dispatch((draft) => {
      draft.redirect = redirect
    })
  }

  return {
    ...state,
    setAppLoading,
    setRedirect,
  }
}

const AppProvider = ({ children }) => {
  const [state, dispatch] = useImmer({ ...defaultState })
  return <AppContext.Provider value={[state, dispatch]}>{children}</AppContext.Provider>
}

export { useAppContext, AppProvider }
