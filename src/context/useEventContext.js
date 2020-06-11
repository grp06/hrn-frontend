import { useContext } from 'react'

import { EventContext } from './EventProvider'

const useEventContext = () => {
  const [state, dispatch] = useContext(EventContext)

  return {
    ...state,
  }
}

export { useEventContext }
