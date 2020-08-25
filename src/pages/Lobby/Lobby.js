import React from 'react'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/styles'

import { useEventContext, useUserContext } from '../../context'
import { getTimeUntilEvent } from '../../utils'
import { PreEventInstructionModal } from '.'
import { StartPreEventButton } from '../Event'

const Lobby = () => {
  const { event, permissions } = useEventContext()
  const { user } = useUserContext()
  const { id: userId } = user
  const { start_at: eventStartTime, host_id, id: eventId } = event
  const micOrCameraIsDisabled = Object.values(permissions).indexOf(false) > -1
  const userIsHost = host_id === userId
  const timeUntilEvent = getTimeUntilEvent(eventStartTime)

  return userIsHost ? (
    <Grid container direction="row" alignItems="center" justify="center">
      <StartPreEventButton
        // disabled={micOrCameraIsDisabled}
        eventId={eventId}
        timeUntilEvent={timeUntilEvent}
      />
      <PreEventInstructionModal />
    </Grid>
  ) : (
    <div>Hello</div>
  )
}

export default Lobby
