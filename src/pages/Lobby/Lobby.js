import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/styles'
import { useHistory } from 'react-router-dom'
import { useSubscription } from '@apollo/react-hooks'

import bannerBackground from '../../assets/eventBannerMountain.png'
import { listenToPartnersTable } from '../../gql/subscriptions'
import { useEventContext, useUserContext, useUserEventStatusContext } from '../../context'
import { useGetCameraAndMicStatus } from '../../hooks'
import {
  BottomControlPanel,
  BroadcastBox,
  EventChatBox,
  EventTimerCountdown,
  UserStatusBox,
  OnlineUsersList,
} from '.'

const useStyles = makeStyles((theme) => ({
  bannerGradient: {
    background:
      'linear-gradient(0deg, rgba(25,25,25,1) 0%, rgba(0,0,0,0) 80%, rgba(0,212,255,0) 100%)',
    width: '100vw',
    height: '55vh',
  },
  broadcastContainer: {
    position: 'relative',
    width: '75vw',
    height: '100%',
    [theme.breakpoints.down('md')]: {
      width: '68vw',
    },
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
    [theme.breakpoints.down('md')]: {
      width: '24vw',
      padding: theme.spacing(0.5),
    },
  },
}))
const Lobby = () => {
  const classes = useStyles()
  const history = useHistory()
  const { event, permissions } = useEventContext()
  const { user } = useUserContext()
  const { setUserEventStatus, userEventStatus, onlineEventUsers } = useUserEventStatusContext()
  const {
    start_at: eventStartTime,
    status: eventStatus,
    id: eventId,
    round,
    event_users,
    host_id,
  } = event
  const { id: userId } = user
  const isEventHost = host_id === userId
  const hasCheckedCamera = useRef()
  // const micOrCameraIsDisabled = Object.values(permissions).indexOf(false) > -1
  useGetCameraAndMicStatus(hasCheckedCamera.current)
  hasCheckedCamera.current = true

  // only do this subscription if you came late or left the chat
  // TODO optimize by not subscribing with less than two minutes
  const { data: myRoundData } = useSubscription(listenToPartnersTable, {
    variables: {
      event_id: eventId,
      user_id: userId,
      round,
    },
    skip:
      ((userEventStatus === 'sitting out' || userEventStatus === 'reported') &&
        eventStatus === 'room-in-progress') ||
      eventStatus === 'not-started',
  })

  // some redirecting stuff
  useEffect(() => {
    if (event_users && event_users.length && userId) {
      const alreadyAttending = event_users.find((u) => u.user.id === userId)
      if (!alreadyAttending) {
        history.push(`/events/${eventId}`)
      }
    }
    if (eventStatus === 'complete') {
      history.push(`/events/${eventId}/event-complete`)
    }
  }, [event_users, eventStatus, userId])

  // this is for when the event first starts
  useEffect(() => {
    if (eventStatus === 'room-in-progress' && userEventStatus === 'waiting for match') {
      history.push(`/events/${eventId}/video-room`)
    }
  }, [eventStatus, userEventStatus])

  // this is only for when you come late or leave a chat and then get rematched
  useEffect(() => {
    if (myRoundData && myRoundData.partners.length && eventStatus === 'room-in-progress') {
      history.push(`/events/${eventId}/video-room`)
    }
  }, [myRoundData, eventStatus])

  return (
    <div className={classes.pageContainer}>
      {eventStatus === 'not-started' && (
        <div className={classes.eventBanner}>
          <div className={classes.bannerGradient} />
        </div>
      )}
      {eventStatus === 'not-started' && <EventTimerCountdown eventStartTime={eventStartTime} />}
      <Grid container direction="row" justify="space-between" className={classes.gridContainer}>
        <Grid
          container
          direction="column"
          justify="space-around"
          className={classes.broadcastContainer}
        >
          <BroadcastBox
            event={event}
            isEventHost={isEventHost}
            onlineUsers={onlineEventUsers}
            userEventStatus={userEventStatus}
          />
          <BottomControlPanel permissions={permissions} event={event} userId={userId} />
        </Grid>
        <Grid
          container
          direction="column"
          justify="space-around"
          className={classes.rightContainer}
        >
          <UserStatusBox
            userEventStatus={userEventStatus}
            eventStatus={eventStatus}
            setUserEventStatus={useCallback(setUserEventStatus, [])}
          />
          <EventChatBox onlineUsers={<OnlineUsersList onlineUsers={onlineEventUsers} />} />
        </Grid>
      </Grid>
    </div>
  )
}

export default Lobby