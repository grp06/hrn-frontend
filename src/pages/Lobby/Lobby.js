import React, { useCallback, useEffect, useRef } from 'react'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/styles'
import { useHistory } from 'react-router-dom'
import { useSubscription } from '@apollo/react-hooks'

import bannerBackground from '../../assets/eventBannerMountain.png'
import { listenToPartnersTable } from '../../gql/subscriptions'
import { useEventContext, useUserContext, useUserEventStatusContext } from '../../context'
import { useGetCameraAndMicStatus } from '../../hooks'
import { getTimeUntilEvent } from '../../utils'
import {
  BottomControlPanel,
  BroadcastBox,
  EventChatBox,
  EventTimerCountdown,
  NextRoundIn,
  OnlineEventUsersList,
} from '.'

// the overflow hidden in broadcastContainer is to help hide the scrollbar
const useStyles = makeStyles((theme) => ({
  bannerGradient: {
    background:
      'linear-gradient(0deg, rgba(25,25,25,1) 0%, rgba(0,0,0,0) 80%, rgba(0,212,255,0) 100%)',
    width: '100vw',
    height: '55vh',
  },
  broadcastContainer: {
    position: 'relative',
    width: '70vw',
    height: '100%',
    [theme.breakpoints.down('md')]: {
      width: '63vw',
    },
    overflow: 'hidden',
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
    padding: theme.spacing(1, 4),
  },
  pageContainer: {
    overflowX: 'hidden',
    overflowY: 'hidden',
  },
  rightContainer: {
    width: '25vw',
    height: '100%',
    padding: theme.spacing(1, 0, 0, 2),
    [theme.breakpoints.down('md')]: {
      width: '29vw',
      padding: theme.spacing(1),
    },
  },
}))
const Lobby = () => {
  const classes = useStyles()
  const history = useHistory()
  const { event, permissions } = useEventContext()
  const { user, userInEvent, setUserInEvent } = useUserContext()
  const { setUserEventStatus, userEventStatus, onlineEventUsers } = useUserEventStatusContext()
  const {
    current_round: round,
    event_users,
    host_id,
    id: eventId,
    round_length,
    start_at: eventStartTime,
    status: eventStatus,
    updated_at: eventUpdatedAt,
  } = event
  const { id: userId } = user
  const isEventHost = host_id && host_id === userId
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

  useEffect(() => {
    setUserInEvent(true)
  }, [])

  useEffect(() => {
    if (getTimeUntilEvent(eventStartTime) > 900000) {
      history.push(`/events/${eventId}`)
    }
  }, [eventStartTime])

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

  // redirect you when you have a partner
  // the round ===1 and waiting for match is to make sure that you get pushed into
  // videoRoom for round 1 even if you are the odd one out. That way userEventStatus
  // gets set properly and you get the correct broadcast screen
  useEffect(() => {
    if (
      (eventStatus === 'room-in-progress' &&
        userEventStatus !== 'sitting out' &&
        myRoundData &&
        myRoundData.partners.length) ||
      (round === 1 && userEventStatus === 'waiting for match')
    ) {
      console.log('myRoundData ->', myRoundData)
      console.log('userEventStatus ->', userEventStatus)
      history.push(`/events/${eventId}/video-room`)
    }
  }, [eventStatus, userEventStatus, myRoundData])

  return (
    <div className={classes.pageContainer}>
      {eventStatus === 'not-started' ? (
        <div className={classes.eventBanner}>
          <div className={classes.bannerGradient} />
        </div>
      ) : null}
      {eventStatus === 'not-started' ? (
        <EventTimerCountdown eventStartTime={eventStartTime} />
      ) : null}

      <Grid container direction="row" justify="space-between" className={classes.gridContainer}>
        {eventStatus !== 'not-started' && eventStatus !== 'pre-event' ? (
          <NextRoundIn
            currentRound={round}
            eventStatus={eventStatus}
            eventUpdatedAt={eventUpdatedAt}
            roundLength={round_length}
          />
        ) : null}
        <Grid
          container
          direction="column"
          justify="space-around"
          className={classes.broadcastContainer}
        >
          <BroadcastBox
            event={event}
            isEventHost={isEventHost}
            onlineEventUsers={onlineEventUsers}
            setUserEventStatus={useCallback(setUserEventStatus, [])}
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
          <EventChatBox
            eventStatus={eventStatus}
            isEventHost={isEventHost}
            onlineEventUsers={<OnlineEventUsersList onlineEventUsers={onlineEventUsers} />}
          />
        </Grid>
      </Grid>
    </div>
  )
}

export default Lobby
