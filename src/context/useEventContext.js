import { useContext } from 'react'

import { EventContext } from './EventProvider'

const useEventContext = () => {
  const [state, dispatch] = useContext(EventContext)

  if (dispatch === undefined) {
    throw new Error('Must have dispatch defined')
  }

  const resetEvent = () => {
    dispatch((draft) => {
      draft.event = {}
    })
  }

  // LETS TRY TO GET RID OF THIS
  const setEventId = (eventId) => {
    dispatch((draft) => {
      draft.eventId = eventId
    })
  }

  return {
    ...state,
    resetEvent,
    setEventId,
  }
}

export default useEventContext
