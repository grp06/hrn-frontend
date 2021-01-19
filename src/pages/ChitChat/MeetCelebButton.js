import React from 'react'
import { TransitionModal } from '../../common'

const MeetCelebButton = ({ hostName, modalBody }) => {
  return TransitionModal({
    button: {
      buttonText: `Meet ${hostName}`,
      buttonVariant: 'contained',
      buttonSize: 'large',
    },
    modalBody,
  })
}

export default MeetCelebButton
