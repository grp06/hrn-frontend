import { useContext } from 'react'

import { UserEventStatusContext } from './UserEventStatusProvider'

const useUserEventStatusContext = () => {
  const [state, dispatch] = useContext(UserEventStatusContext)

  if (dispatch === undefined) {
    throw new Error('Must have dispatch defined')
  }

  const setNumberOfReadMessagesFromMyPartner = (readMessagesCount) => {
    dispatch((draft) => {
      draft.numberOfReadMessagesFromMyPartner = readMessagesCount
    })
  }

  const setUserEventStatus = (status) => {
    console.log('setUSerEventStatus ->', status)
    dispatch((draft) => {
      draft.userEventStatus = status
    })
  }

  const setUserHasEnabledCameraAndMic = (userHasEnabledCameraAndMic) => {
    dispatch((draft) => {
      draft.userHasEnabledCameraAndMic = userHasEnabledCameraAndMic
    })
  }

  return {
    ...state,
    setNumberOfReadMessagesFromMyPartner,
    setUserEventStatus,
    setUserHasEnabledCameraAndMic,
  }
}

export default useUserEventStatusContext
