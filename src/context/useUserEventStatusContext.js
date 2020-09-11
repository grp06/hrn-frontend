import { useContext } from 'react'

import { UserEventStatusContext } from './UserEventStatusProvider'

const useUserEventStatusContext = () => {
  const [state, dispatch] = useContext(UserEventStatusContext)

  if (dispatch === undefined) {
    throw new Error('Must have dispatch defined')
  }

  //set User's event status: could be "noPartner" "leftChat" "late" "waitGetMatch"
  const setUserStatus = (status) => {
    dispatch((draft) => {
      draft.userEventStatus.status = status
      if (status === 'noPartner') {
        draft.userEventStatus.partner = null
      }
    })
  }

  return {
    ...state,
    setUserStatus,
  }
}

export default useUserEventStatusContext
