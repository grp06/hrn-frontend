import React from 'react'
import Typography from '@material-ui/core/Typography'
import { TransitionModal } from '../../common'

const StartChitChatButton = () => {
  return (
    <div style={{ width: '100%' }}>
      {TransitionModal({
        button: {
          buttonText: 'Start Event',
          buttonVariant: 'contained',
          buttonSize: 'large',
          buttonStyle: {
            width: '100%',
          },
        },
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
        onAcceptFunction: () => {
          console.log('TODO create startChitChat api call')
        },
      })}
    </div>
  )
}

export default StartChitChatButton
