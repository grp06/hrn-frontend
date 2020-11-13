import React from 'react'
import Typography from '@material-ui/core/Typography'
import { useHistory } from 'react-router-dom'
import { TransitionModal } from '../../common'

const LeaveEventButton = ({ event_id }) => {
  const history = useHistory()
  return TransitionModal({
    button: {
      buttonText: 'Leave Event',
      buttonVariant: 'contained',
      buttonSize: 'large',
    },
    modalBody: <Typography variant="h3">Are you sure you want to leave the event?</Typography>,
    onAcceptButtonText: 'Leave Event',
    onAcceptFunction: async () => {
      try {
        await window.room.disconnect()
        window.room = null
        history.push(`/events/${event_id}/event-complete`)
      } catch (err) {
        console.log(err)
      }
    },
  })
}

export default LeaveEventButton
