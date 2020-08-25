import React from 'react'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/styles'

import { useEventContext, useUserContext } from '../../context'
import { getTimeUntilEvent } from '../../utils'
import {
  BottomControlPanel,
  BroadcastBox,
  EventChatBox,
  EventTimerCountdown,
  UserStatusBox,
} from '.'

const useStyles = makeStyles((theme) => ({
  pageContainer: {
    overflowX: 'hidden',
    overflowY: 'hidden',
  },
  broadcastContainer: {
    width: '75vw',
    height: '100%',
  },
  gridContainer: {
    width: '100vw',
    height: '100vh',
    padding: theme.spacing(2),
  },
  rightContainer: {
    width: '20vw',
    height: '100%',
    padding: theme.spacing(2),
  },
}))
const Lobby = () => {
  const classes = useStyles()
  const { event, permissions } = useEventContext()
  const { user } = useUserContext()
  const { id: userId } = user
  const { start_at: eventStartTime, host_id, id: eventId } = event
  const userIsHost = host_id === userId
  const timeUntilEvent = getTimeUntilEvent(eventStartTime)

  return (
    <div className={classes.pageContainer}>
      <EventTimerCountdown eventStartTime={eventStartTime} />
      <Grid container direction="row" className={classes.gridContainer}>
        <Grid direction="column" justify="space-around" className={classes.broadcastContainer}>
          <BroadcastBox />
          <BottomControlPanel
            permissions={permissions}
            eventId={eventId}
            userIsHost={userIsHost}
            timeUntilEvent={timeUntilEvent}
          />
        </Grid>
        <Grid direction="column" justify="space-around" className={classes.rightContainer}>
          <UserStatusBox />
          <EventChatBox />
        </Grid>
      </Grid>
    </div>
  )
}

export default Lobby
