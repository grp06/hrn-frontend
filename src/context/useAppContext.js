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

  function setEventId(eventId) {
    dispatch((draft) => {
      console.log('draft = ', draft)

      draft.event.eventId = eventId
    })
  }

  return {
    ...state,
    setRedirect,
    setUserId,
    setEventId,
  }
}

export { useAppContext }
