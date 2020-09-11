import React, { useState, useEffect, useCallback } from 'react'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/styles'
import { useHistory } from 'react-router-dom'

import bannerBackground from '../../assets/eventBannerMountain.png'
import { useEventContext, useUserContext, useUserEventStatusContext } from '../../context'
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
  const history = useHistory()
  const { event, permissions } = useEventContext()
  const { user } = useUserContext()
  const { setUserEventStatus } = useUserEventStatusContext()
  const [userSittingOut, setUserSittingOut] = useState(false)
  const { start_at: eventStartTime, status: eventStatus, id: eventId } = event
  const { id: userId } = user
  const userLeftChat = JSON.parse(localStorage.getItem('userLeftChat'))

  useEffect(() => {
    if (eventStatus === 'room-in-progress' && !userLeftChat) {
      history.push(`/events/${eventId}/video-room`)
    }
  }, [eventStatus, userLeftChat])

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
          <BottomControlPanel permissions={permissions} event={event} userId={userId} />
        </Grid>
        <Grid
          container
          direction="column"
          justify="space-around"
          className={classes.rightContainer}
        >
          <UserStatusBox
            eventStatus={eventStatus}
            userSittingOut={userSittingOut}
            onToggleClick={useCallback((passedInState) => setUserSittingOut(passedInState), [])}
          />
          <EventChatBox event={event} />
        </Grid>
      </Grid>
    </div>
  )
}

export default Lobby
