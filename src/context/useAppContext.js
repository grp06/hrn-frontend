import { useContext } from 'react'

import { AppContext } from './AppProvider'

const useAppContext = () => {
  const [state, dispatch] = useContext(AppContext)

  if (dispatch === undefined) {
    throw new Error('Must have dispatch defined')
  }

  function setRedirect(redirect) {
    dispatch((draft) => {
      draft.redirect = redirect
    })
  }

  function setUserId(userId) {
    dispatch((draft) => {
      draft.userId = userId
    })
  }
  function setCurrentRound(userId) {
    dispatch((draft) => {
      draft.userId = userId
    })
  }

  return {
    ...state,
    setRedirect,
    setUserId,
    setCurrentRound,
  }
}

export { useAppContext }
