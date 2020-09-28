import { useContext } from 'react'

import { AppContext } from './AppProvider'

const useAppContext = () => {
  const [state, dispatch] = useContext(AppContext)

  if (dispatch === undefined) {
    throw new Error('Must have dispatch defined')
  }

  const setAppLoading = (loading) => {
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

export default useAppContext
