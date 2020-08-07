import React, { useState, useRef } from 'react'
import { useHistory } from 'react-router-dom'
import Grid from '@material-ui/core/Grid'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/styles'

import { StartEventButton, OnlineUsersMenu } from '.'
import { TransitionModal } from '../../common'
import { startEvent } from '../../helpers'

const useStyles = makeStyles((theme) => ({
  listItemText: {
    fontFamily: 'Muli',
    color: theme.palette.common.ghostWhiteBody,
    fontSize: '1rem',
    '&:hover': { color: theme.palette.common.sunray },
  },
  onlineUsersText: {
    color: theme.palette.common.sunray,
    textAlign: 'center',
  },
}))

const EventControlsDrawerContent = ({ user, event }) => {
  const classes = useStyles()
  const history = useHistory()
  const { host_id, id: eventId, event_users } = event

  const handleResetEventModal = TransitionModal({
    button: {
      buttonText: 'Reset Event',
      buttonVariant: 'text',
      buttonColor: 'link',
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

  const onlineUsersList =
    event_users.length <= 14 ? (
      <OnlineUsersMenu eventUsers={event_users} />
    ) : (
      <Grid container justify="center" alignItems="center">
        <Typography variant="subtitle1" className={classes.onlineUsersText}>
          Online Users: {event_users.length}
        </Typography>
      </Grid>
    )

  return (
    <Grid container direction="column" justify="center" alignItems="center">
      <List>
        <ListItem>
          <StartEventButton event={event} user={user} />
        </ListItem>
        <ListItem>{onlineUsersList}</ListItem>
        <ListItem>
          <Grid container justify="center" alignItems="center">
            {handleResetEventModal}
          </Grid>
        </ListItem>
      </List>
    </Grid>
  )
}

export default EventControlsDrawerContent
