import React, { useEffect, useState } from 'react'
import Typography from '@material-ui/core/Typography'
import { useMutation, useSubscription } from 'react-apollo'
import { TransitionModal } from '../../common'
import { updateChitChatStatus, updateFanStatus } from '../../gql/mutations'
import { listenToOnlineFansByChitChatId } from '../../gql/subscriptions'

const StartChitChatButton = ({ chitChatId, userId }) => {
  const [onlineFans, setOnlineFans] = useState(null)
  const [updateChitChatStatusMutation] = useMutation(updateChitChatStatus)
  const [updateFanStatusMutation] = useMutation(updateFanStatus)
  const { data: onlineFansData, loading: fansLoading } = useSubscription(
    listenToOnlineFansByChitChatId,
    {
      variables: {
        chitChatId,
      },
      skip: !chitChatId,
    }
  )

  const startChitChatHandler = async () => {
    try {
      await updateChitChatStatusMutation({
        variables: {
          chitChatId,
          userId,
          status: 'call-in-progress',
        },
      })
      const firstFanToMeet = onlineFansData.online_event_users_new[0].user_id

      await updateFanStatusMutation({
        variables: {
          userId: firstFanToMeet,
          status: 'in-chat',
        },
      })
    } catch (error) {
      console.log('error = ', error)
    }
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
        onAcceptFunction: () => startChitChatHandler(),
      })}
    </div>
  )
}

export default StartChitChatButton
