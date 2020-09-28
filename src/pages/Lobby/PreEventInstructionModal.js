import React from 'react'
import Typography from '@material-ui/core/Typography'
import HelpOutlineIcon from '@material-ui/icons/HelpOutline'
import { TransitionModal } from '../../common'

const PreEventInstructionModal = () => {
  return TransitionModal({
    modalBody: (
      <div>
        <Typography variant="h5" gutterBottom>
          Some Tips for hosting:
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          As a host, when you press 'start pre-event speech' you'll have a few minutes to address
          your audience.
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          It takes a few seconds for everyone to connect to this broadcast room, so we suggest that
          you wait about 5 - 10 seconds after seeing your own video (you wont see any of your
          participants' video). This way your speech isn't cut off in the beginning.
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          When you're ready to start the event after your speech just go ahead and press the 'start
          event button' that will be on the top left of your screen.
        </Typography>
        <Typography variant="h6">Enjoy the event ✨</Typography>
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

export default PreEventInstructionModal
