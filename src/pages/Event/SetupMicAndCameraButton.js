import React from 'react'
import SettingsIcon from '@material-ui/icons/Settings'
import { SetupMicAndCamera } from '.'
import { TransitionModal } from '../../common'

const SetupMicAndCameraButton = ({ permissions, textButtonSetMicCam }) => {
  const button =
    permissions && permissions.isWebcamAlreadyCaptured && !!textButtonSetMicCam
      ? {
          buttonText: 'Test Your Camera and Mic 🎥',
          buttonVariant: 'contained',
          buttonSize: 'large',
        }
      : null

  const fabButton =
    permissions && permissions.isWebcamAlreadyCaptured && !textButtonSetMicCam
      ? {
          fabButtonIcon: <SettingsIcon style={{ color: '#6327bb' }} />,
          fabButtonSize: 'small',
          fabButtonColor: 'inherit',
        }
      : null

  return TransitionModal({
    fabButton,
    button,
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
