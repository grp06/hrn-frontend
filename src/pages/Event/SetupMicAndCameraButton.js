import React from 'react'
import SettingsIcon from '@material-ui/icons/Settings'
import { SetupMicAndCamera } from '../Lobby'
import { TransitionModal } from '../../common'

const SetupMicAndCameraButton = () => {
  const fabButton = {
    fabButtonIcon: <SettingsIcon style={{ color: '#6327bb' }} />,
    fabButtonSize: 'small',
    fabButtonColor: 'inherit',
  }

  return TransitionModal({
    fabButton,
    modalBody: <SetupMicAndCamera />,
    onAcceptButtonText: 'Done',
    onAcceptFunction: async () => {
      window.analytics.track('Opened test camera')
      const video = document.getElementById('videoElement')
      if (video) {
        video.remove()
      }
    },
    hideNoWay: true,
  })
}

export default SetupMicAndCameraButton
