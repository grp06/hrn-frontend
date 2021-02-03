import React, { useEffect, useState } from 'react'
import Typography from '@material-ui/core/Typography'

import { TransitionModal } from '../../common'
import { useChitChatHelpers } from '../../helpers'

const StartChitChatButton = ({ onlineChitChatUsersArray, chitChatId, disabled, userId }) => {
  const { startNextChitChat } = useChitChatHelpers()

  return (
    <div style={{ width: '100%' }}>
      {TransitionModal({
        button: {
          buttonText: 'Start Event',
          buttonVariant: 'contained',
          buttonSize: 'large',
          buttonStyle: {
            width: '100%',
            backgroundColor: 'rgba(36, 37, 38, 1)',
          },
        },
        disabled: disabled,
        modalBody: (
          <Typography variant="h3">
            You&apos;re about to meet your awesome fans{' '}
            <span role="img" aria-label="party face">
              🥳
            </span>{' '}
            Are you ready to start?
          </Typography>
        ),
        onAcceptButtonText: 'Lets Start!',
        onAcceptFunction: () => startNextChitChat({ onlineChitChatUsersArray, chitChatId, userId }),
      })}
    </div>
  )
}

export default StartChitChatButton
