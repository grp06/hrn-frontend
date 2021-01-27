import React from 'react'
import Typography from '@material-ui/core/Typography'
import HelpOutlineIcon from '@material-ui/icons/HelpOutline'
import { TransitionModal } from '../../common'

const VisualQueueInstructionModal = ({ hostFirstName }) => {
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
          Your queue number is a real-time representation of when you will meet {hostFirstName}.
        </Typography>
        <Typography variant="body1" gutterBottom>
          Your position in the queue will change if people who RSVP'd before you come online.
        </Typography>
        <Typography variant="body1" gutterBottom>
          <span role="img" aria-label="ticket">
            🎫
          </span>{' '}
          Think of your RSVP number like your ticket number. If someone shows up with a lower ticket
          number, they'll be ahead of you in the queue, pushing your time slot back.
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
