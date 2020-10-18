import React, { useEffect } from 'react'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/styles'
import { useHistory } from 'react-router-dom'
import { useSubscription } from '@apollo/react-hooks'

import bannerBackground from '../../assets/eventBannerMountain.png'
import { listenToPartnersTable } from '../../gql/subscriptions'
import {
  useAppContext,
  useEventContext,
  useUserContext,
  useUserEventStatusContext,
} from '../../context'
import { getTimeUntilEvent } from '../../utils'
import { Loading } from '../../common'
import {
  BottomControlPanel,
  BroadcastBox,
  CameraAndMicSetupScreen,
  EventChatBox,
  NextRoundIn,
  OnlineAttendeesCard,
} from '.'
import {
  EventRSVPsCard,
  EventCountdown,
  EventTitleAndCTACard,
  HostAndEventDescCard,
  PodcastCard,
  WhatToExpect,
} from '../Event'

// the overflow hidden in broadcastContainer is to help hide the scrollbar
const useStyles = makeStyles((theme) => ({
  bannerGradient: {
    background:
      'linear-gradient(0deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 58%, rgba(0,212,255,0) 100%)',
    height: 'auto',
    minHeight: '55vh',
    width: '100%',
    position: 'absolute',
    top: '0%',
    bottom: 'auto',
  },
  eventBanner: {
    width: '100%',
    height: 'auto',
    minHeight: '55vh',
    backgroundImage: `url(${bannerBackground})`,
    backgroundPosition: '50% 50%',
    backgroundSize: 'cover',
    zIndex: '-3',
  },
  eventContentContainer: {
    position: 'relative',
    zIndex: '99',
    width: '90%',
    maxWidth: '1560px',
    margin: theme.spacing(-20, 'auto', 0, 'auto'),
  },
  pageContainer: {
    overflowX: 'hidden',
    overflowY: 'hidden',
    paddingBottom: '100px',
  },
  podcastContainer: {
    width: '44%',
    marginBottom: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
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
  whatToExpectContainer: {
    width: '55%',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
    marginBottom: theme.spacing(2),
  },
  whatToExpectAndPodcastContainer: {
    marginTop: theme.spacing(2),
  },
}))
const NewLobby = () => {
  const classes = useStyles()
  const history = useHistory()
  const { appLoading } = useAppContext()
  const { event } = useEventContext()
  const { user, setUserInEvent } = useUserContext()
  const {
    onlineEventUsers,
    setUserEventStatus,
    setUserHasEnabledCameraAndMic,
    userEventStatus,
    userHasEnabledCameraAndMic,
  } = useUserEventStatusContext()
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
  const { id: user_id, name: usersName } = user
  const userIsHost = parseInt(host_id, 10) === parseInt(user_id, 10)

  // only do this subscription if you came late or left the chat
  // TODO optimize by not subscribing with less than two minutes
  const { data: myRoundData } = useSubscription(listenToPartnersTable, {
    variables: {
      event_id: eventId,
      user_id: user_id,
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
    if (event_users && event_users.length && user_id) {
      const alreadyAttending = event_users.find((u) => u.user.id === user_id)
      if (!alreadyAttending) {
        history.push(`/events/${eventId}`)
      }
    }
    if (eventStatus === 'complete') {
      history.push(`/events/${eventId}/event-complete`)
    }
  }, [event_users, eventStatus, user_id])

  // redirect you when you have a partner
  // the round ===1 and waiting for match is to make sure that you get pushed into
  // videoRoom for round 1 even if you are the odd one out. That way userEventStatus
  // gets set properly and you get the correct broadcast screen
  useEffect(() => {
    if (
      (eventStatus === 'room-in-progress' &&
        userEventStatus !== 'sitting out' &&
        myRoundData &&
        myRoundData.partners.length &&
        userHasEnabledCameraAndMic) ||
      (round === 1 && userEventStatus === 'waiting for match')
    ) {
      console.log('myRoundData ->', myRoundData)
      console.log('userEventStatus ->', userEventStatus)
      history.push(`/events/${eventId}/video-room`)
    }
  }, [eventStatus, userEventStatus, myRoundData])

  if (appLoading || Object.keys(event).length < 2) {
    return <Loading />
  }

  if (!userHasEnabledCameraAndMic) {
    return <CameraAndMicSetupScreen usersName={usersName} />
  }

  return (
    <div className={classes.pageContainer}>
      {eventStatus === 'not-started' ? <EventCountdown eventStartTime={eventStartTime} /> : null}
      {eventStatus !== 'not-started' && eventStatus !== 'pre-event' ? (
        <NextRoundIn
          currentRound={round}
          eventStatus={eventStatus}
          eventUpdatedAt={eventUpdatedAt}
          roundLength={round_length}
        />
      ) : null}

      <Grid container>
        <div className={classes.eventBanner} />
        <div className={classes.bannerGradient} />
      </Grid>
      <Grid
        container
        direction="column"
        justify="flex-start"
        className={classes.eventContentContainer}
      >
        <EventTitleAndCTACard event={event} user={user} />
        <HostAndEventDescCard event={event} showOnlineAttendees={onlineEventUsers.length} />
        <Grid
          container
          direction="row"
          justify="space-between"
          className={classes.whatToExpectAndPodcastContainer}
        >
          <Grid className={classes.whatToExpectContainer}>
            <WhatToExpect userIsHost={userIsHost} />
          </Grid>
          <Grid className={classes.podcastContainer}>
            {userIsHost ? (
              <OnlineAttendeesCard onlineEventUsers={onlineEventUsers} />
            ) : (
              <PodcastCard />
            )}
          </Grid>
        </Grid>
        {userIsHost ? (
          <Grid container direction="row" justify="flex-end">
            <div className={classes.podcastContainer}>
              <PodcastCard />
            </div>
          </Grid>
        ) : null}

        {/* <BroadcastBox
            event={event}
            onlineEventUsers={onlineEventUsers}
            setUserEventStatus={setUserEventStatus}
            userEventStatus={userEventStatus}
          /> */}
      </Grid>
      {/* <EventChatBox
            eventStatus={eventStatus}
            onlineEventUsers={<OnlineAttendeesCard onlineEventUsers={onlineEventUsers} />}
          /> */}
      <BottomControlPanel
        event={event}
        setUserHasEnabledCameraAndMic={setUserHasEnabledCameraAndMic}
        userId={user_id}
        userHasEnabledCameraAndMic={userHasEnabledCameraAndMic}
      />
    </div>
  )
}

export default NewLobby
