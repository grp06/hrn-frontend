import React, { createContext, useContext } from 'react'
import { useImmer } from 'use-immer'

const AppContext = createContext()

const defaultState = {
  redirect: null,
}

const useAppContext = () => {
  const [state, dispatch] = useContext(AppContext)

  if (dispatch === undefined) {
    throw new Error('Must have dispatch defined')
  }

  const setRedirect = (redirect) => {
    dispatch((draft) => {
      draft.redirect = redirect
    })
  }

  return {
    ...state,
    setRedirect,
  }
}

const AppProvider = ({ children }) => {
  const [state, dispatch] = useImmer({ ...defaultState })
  return <AppContext.Provider value={[state, dispatch]}>{children}</AppContext.Provider>
}

export { useAppContext, AppProvider }
