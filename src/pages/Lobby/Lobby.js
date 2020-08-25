import React from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import HelpOutlineIcon from '@material-ui/icons/HelpOutline'

import { TransitionModal } from '../../common'
import { useEventContext, useUserContext } from '../../context'
import { StartPreEventButton } from '../Event'
import { makeStyles } from '@material-ui/styles'

const Lobby = () => {
  const { event, permissions } = useEventContext()
  const { user } = useUserContext()
  const { id: userId } = user
  const { start_at: eventStartTime, host_id } = event
  const micOrCameraIsDisabled = Object.values(permissions).indexOf(false) > -1
  const userIsHost = host_id === userId

  const instructionModal = TransitionModal({
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
      iconButtonIcon: <HelpOutlineIcon />,
      iconButtonColor: 'secondary',
    },
    onAcceptFunction: () => {},
    onAcceptButtonText: 'Ok, got it',
    hideNoWay: {},
  })

  return userIsHost ? (
    <Grid container direction="row" alignItems="center" justify="center">
      <StartPreEventButton
        // disabled={micOrCameraIsDisabled}
        // within30Mins
        eventStartTime={eventStartTime}
      />
      <div>{instructionModal}</div>
    </Grid>
  ) : (
    <div>Hello</div>
  )
}

export default Lobby
