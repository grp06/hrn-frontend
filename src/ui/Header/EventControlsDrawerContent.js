import React from 'react'
import { useHistory } from 'react-router-dom'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/styles'

import { StartEventButton } from '.'
import { TransitionModal } from '../../common'
import { startEvent } from '../../helpers'

const useStyles = makeStyles((theme) => ({
  listItemText: {
    fontFamily: 'Muli',
    color: theme.palette.common.ghostWhiteBody,
    fontSize: '1rem',
    '&:hover': { color: theme.palette.common.sunray },
  },
}))

const EventControlsDrawerContent = ({ user, event }) => {
  const classes = useStyles()
  const history = useHistory()
  const { host_id, id: eventId } = event

  const handleResetEventModal = TransitionModal({
    button: {
      buttonText: 'Reset Event',
      buttonVariant: 'text',
      buttonColor: 'default',
    },
    modalBody: (
      <Typography variant="h5">
        This will reset the event in its entirety. Are you 100% sure?
      </Typography>
    ),
    onAcceptFunction: async () => {
      window.analytics &&
        window.analytics.track('Event reset', {
          eventId,
          hostId: host_id,
        })
      await startEvent({ eventId, num_rounds: null, round_length: null, reset: true })
    },
  })

  return (
    <div>
      <List>
        <ListItem>
          <StartEventButton event={event} user={user} />
        </ListItem>
        <ListItem>{handleResetEventModal}</ListItem>
      </List>
    </div>
  )
}

export default EventControlsDrawerContent
