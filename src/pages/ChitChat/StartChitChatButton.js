import React from 'react'
import Typography from '@material-ui/core/Typography'
import { useMutation } from 'react-apollo'
import { TransitionModal } from '../../common'
import { updateChitChatStatus } from '../../gql/mutations'

const StartChitChatButton = ({ chitChatId, userId }) => {
  const [updateChitChatStatusMutation] = useMutation(updateChitChatStatus)

  const startChitChatHandler = () => {
    console.log('🚀 ~ StartChitChatButton ~ userId', userId)
    console.log('🚀 ~ StartChitChatButton ~ chitChatId', chitChatId)
    updateChitChatStatusMutation({
      variables: {
        chitChatId,
        userId,
        status: 'call-in-progress',
      },
    })
  }
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
        onAcceptFunction: startChitChatHandler,
      })}
    </div>
  )
}

export default StartChitChatButton
