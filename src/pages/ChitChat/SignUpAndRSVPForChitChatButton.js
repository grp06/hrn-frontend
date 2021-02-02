import React from 'react'
import { TransitionModal } from '../../common'

const SignUpAndRSVPForChitChatButton = ({ hostName, modalBody }) => {
  return (
    <div style={{ width: '100%' }}>
      {TransitionModal({
        button: {
          buttonText: `Meet ${hostName}`,
          buttonVariant: 'contained',
          buttonSize: 'large',
          buttonStyle: {
            width: '100%',
          },
        },
        modalBody,
      })}
    </div>
  )
}

export default SignUpAndRSVPForChitChatButton
