import React from 'react'
import { TransitionModal } from './'
import { startEvent } from '../helpers'

const StartEventButton = ({ event, user }) => {
  const { id: eventId, round_length, num_rounds, status: eventStatus, host_id } = event
  const { userId } = user
  const isEventHost = host_id === userId

  console.log('renderStart Event Button')
  return isEventHost && eventStatus === 'pre-event'
    ? TransitionModal({
        button: {
          buttonText: 'Start Event 🥳',
          buttonVariant: 'contained',
        },
        modalBody:
          'Starting the event will stop your current broadcast. Are you sure you want to start the event?',
        onAcceptButtonText: 'Lets Start!',
        onAcceptFunction: async () => {
          startEvent({ eventId, round_length, num_rounds })
        },
      })
    : null
}

export default StartEventButton
