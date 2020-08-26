import React from 'react'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/styles'

import bannerBackground from '../../assets/eventBannerMountain.png'
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
  bannerGradient: {
    background:
      'linear-gradient(0deg, rgba(25,25,25,1) 0%, rgba(0,0,0,0) 58%, rgba(0,212,255,0) 100%)',
    width: '100vw',
    height: '55vh',
  },
  broadcastContainer: {
    width: '75vw',
    height: '100%',
  },
  eventBanner: {
    position: 'absolute',
    width: '100%',
    height: 'auto',
    minHeight: '55vh',
    backgroundImage: `url(${bannerBackground})`,
    backgroundPosition: '50% 50%',
    backgroundSize: 'cover',
    zIndex: '-3',
  },
  gridContainer: {
    width: '100vw',
    height: '100vh',
    padding: theme.spacing(2),
  },
  pageContainer: {
    overflowX: 'hidden',
    overflowY: 'hidden',
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
  const { start_at: eventStartTime, host_id, id: eventId, status: eventStatus } = event
  const userIsHost = host_id === userId
  const timeUntilEvent = getTimeUntilEvent(eventStartTime)
  console.log('event_status ->', eventStatus)

  return (
    <div className={classes.pageContainer}>
      {eventStatus === 'not-started' && (
        <div className={classes.eventBanner}>
          <div className={classes.bannerGradient} />
        </div>
      )}
      {eventStatus === 'not-started' && <EventTimerCountdown eventStartTime={eventStartTime} />}
      <Grid container direction="row" className={classes.gridContainer}>
        <Grid
          container
          direction="column"
          justify="space-around"
          className={classes.broadcastContainer}
        >
          <BroadcastBox event={event} />
          <BottomControlPanel
            permissions={permissions}
            eventId={eventId}
            userIsHost={userIsHost}
            timeUntilEvent={timeUntilEvent}
          />
        </Grid>
        <Grid
          container
          direction="column"
          justify="space-around"
          className={classes.rightContainer}
        >
          <UserStatusBox />
          <EventChatBox />
        </Grid>
      </Grid>
    </div>
  )
}

export default Lobby
