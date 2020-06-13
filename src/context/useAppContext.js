import { useContext } from 'react'

import { AppContext } from './AppProvider'

const useAppContext = () => {
  const [state, dispatch] = useContext(AppContext)

  if (dispatch === undefined) {
    throw new Error('Must have dispatch defined')
  }

  function setRedirect(redirect) {
    dispatch((draft) => {
      draft.app.redirect = redirect
    })
  }

  function setUserId(userId) {
    dispatch((draft) => {
      draft.user.userId = userId
    })
  }

  return {
    ...state,
    setRedirect,
    setUserId,
  }
}

export { useAppContext }
