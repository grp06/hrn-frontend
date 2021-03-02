import React from 'react'
import { Typography } from '@material-ui/core'
import { TransitionModal } from '../../common'
import { endEvent } from '../../helpers'

const EndEventButton = ({ event_id }) => {
  return TransitionModal({
    button: {
      buttonText: 'End Event',
      buttonVariant: 'contained',
      buttonSize: 'large',
    },
    modalBody: (
      <Typography variant="h3">
        Ending the event will end the group call for everyone. Are you sure you want to end the
        event?
      </Typography>
    ),
    onAcceptButtonText: 'End Event',
    onAcceptFunction: async () => {
      endEvent(event_id)
    },
  })
}

export default EndEventButton
