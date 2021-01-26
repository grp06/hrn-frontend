import React from 'react'
import Typography from '@material-ui/core/Typography'
import HelpOutlineIcon from '@material-ui/icons/HelpOutline'
import { TransitionModal } from '../../common'

const VisualQueueInstructionModal = () => {
  return TransitionModal({
    modalBody: (
      <div>
        <Typography variant="h3" gutterBottom style={{ marginBottom: '20px' }}>
          How the Queue works{' '}
          <span role="img" aria-label="okay hand">
            👌
          </span>
        </Typography>
        <Typography variant="body1" gutterBottom>
          Your queue number is a real-time representation of when you will meet the host of the
          event.
        </Typography>
        <Typography variant="body1" gutterBottom>
          Your position in the queue is subject to change as more and more people come online.
        </Typography>
        <Typography variant="body1" gutterBottom>
          <span role="img" aria-label="ticket">
            🎫
          </span>{' '}
          Think of your RSVP number like your ticket number. If someone with a lower RSVP number
          shows up, they get to go ahead of the queue, pushing your time slot back.
        </Typography>
      </div>
    ),
    iconButton: {
      iconButtonIcon: <HelpOutlineIcon style={{ color: '#f4f6fa' }} />,
      iconButtonColor: 'inherit',
    },
    onAcceptFunction: () => {},
    onAcceptButtonText: 'Ok, got it',
    hideNoWay: {},
  })
}

export default VisualQueueInstructionModal
