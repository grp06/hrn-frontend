import React from 'react'
import { TransitionModal } from '../../common'
import { startEvent } from '../../helpers'
import Typography from '@material-ui/core/Typography'

const StartEventButton = ({ event, user }) => {
  const { id: eventId, round_length, num_rounds, status: eventStatus, host_id } = event
  const { id: userId } = user
  const isEventHost = host_id === userId

  return isEventHost && eventStatus === 'pre-event'
    ? TransitionModal({
        button: {
          buttonText: 'Start Event 🥳',
          buttonVariant: 'contained',
        },
        modalBody: (
          <Typography variant="h5">
            Starting the event will stop your current broadcast. Are you sure you want to start the
            event?
          </Typography>
        ),
        onAcceptButtonText: 'Lets Start!',
        onAcceptFunction: async () => {
          startEvent({ eventId, round_length, num_rounds })
        },
      })
    : null
}

export default StartEventButton
