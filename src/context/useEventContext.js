import { useContext } from 'react'

import { EventContext } from './EventProvider'

const useEventContext = () => {
  console.log('EventContext', EventContext)

  const [state, dispatch] = useContext(EventContext)

  if (dispatch === undefined) {
    throw new Error('Must have dispatch defined')
  }

  return {
    ...state,
  }
}

export { useEventContext }
