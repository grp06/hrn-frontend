import React from 'react'

import { SetupMicAndCamera } from '.'
import { TransitionModal } from '../../common'

const SetupMicAndCameraButton = ({ permissions }) => {
  return TransitionModal({
    button: {
      buttonText:
        permissions && permissions.isWebcamAlreadyCaptured
          ? 'Test out your camera'
          : 'Click to enable',
      buttonVariant: 'contained',
      buttonSize: 'medium',
    },
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
