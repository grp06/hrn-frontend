import { useContext } from 'react'

import { UserEventStatusContext } from './UserEventStatusProvider'

const useUserEventStatusContext = () => {
  const [state, dispatch] = useContext(UserEventStatusContext)

  if (dispatch === undefined) {
    throw new Error('Must have dispatch defined')
  }

  // set User's event status: could be "noPartner" "leftChat" "late" "waitGetMatch"
  const setUserEventStatus = (status) => {
    console.log('setUSerEventStatus ->', status)
    dispatch((draft) => {
      draft.userEventStatus = status
    })
  }

  return {
    ...state,
    setUserEventStatus,
  }
}

export default useUserEventStatusContext
