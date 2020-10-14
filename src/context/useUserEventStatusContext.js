import { useContext } from 'react'

import { UserEventStatusContext } from './UserEventStatusProvider'

const useUserEventStatusContext = () => {
  const [state, dispatch] = useContext(UserEventStatusContext)

  if (dispatch === undefined) {
    throw new Error('Must have dispatch defined')
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

  const setUsersListOfAudioDevices = (arrayOfAudioDevices) => {
    dispatch((draft) => {
      draft.usersListOfAudioDevices = arrayOfAudioDevices
    })
  }
  const setUsersListOfVideoDevices = (arrayOfVideoDevices) => {
    console.log('arrayOfVideoDevices ->', arrayOfVideoDevices)
    dispatch((draft) => {
      draft.usersListOfVideoDevices = arrayOfVideoDevices
    })
  }

  const setUsersPreferredAudioDevice = (audioDevice) => {
    console.log('audioDevice', audioDevice)
    dispatch((draft) => {
      draft.usersPreferredAudioDevice = audioDevice
    })
  }

  const setUsersPreferredVideoDevice = (videoDevice) => {
    console.log('videoDevice', videoDevice)
    dispatch((draft) => {
      draft.usersPreferredVideoDevice = videoDevice
    })
  }

  return {
    ...state,
    setUserEventStatus,
    setUserHasEnabledCameraAndMic,
    setUsersListOfAudioDevices,
    setUsersListOfVideoDevices,
    setUsersPreferredAudioDevice,
    setUsersPreferredVideoDevice,
  }
}

export default useUserEventStatusContext
