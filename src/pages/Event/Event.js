import React, { useEffect } from 'react'

import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/styles'

import {
  AboutTheHostCard,
  EventPhotoBanner,
  EventRSVPsCard,
  EventStatusRedirect,
  EventTitleAndCTACard,
  HostAndEventDescCard,
  JoinEventBanner,
  PodcastCard,
  WhatToExpect,
} from '.'
import { Loading } from '../../common'
import { useAppContext, useEventContext, useUserContext } from '../../context'

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
    zIndex: '-3',
    marginBottom: '80px',
    backgroundPosition: '50% 50% !important',
    backgroundSize: 'cover !important',
  },
  eventContentContainer: {
    position: 'relative',
    zIndex: '99',
    width: '75vw',
    maxWidth: '1560px',
    margin: theme.spacing(-20, 'auto', 0, 'auto'),
    paddingBottom: '40px',
    [theme.breakpoints.down('sm')]: {
      width: '90vw',
    },
  },
  podcastContainer: {
    width: '44%',
    marginBottom: theme.spacing(3),
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
  subtitle: {
    margin: theme.spacing(1),
    marginBottom: '10px',
    width: '75%',
    [theme.breakpoints.down('sm')]: {
      width: '90%',
    },
  },
  whatToExpectContainer: {
    width: '54%',
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
    marginBottom: theme.spacing(3),
  },
}))

const Event = () => {
  const classes = useStyles()
  const { user, userContextLoading } = useUserContext()
  const { event, eventContextLoading } = useEventContext()
  const { id: user_id } = user
  const { banner_photo_url, event_users, host, host_id, status: event_status, id: eventId } = event
  // get rid of this

  if (userContextLoading || eventContextLoading) {
    return <Loading />
  }

  localStorage.setItem('eventId', eventId)
  localStorage.setItem('event', JSON.stringify(event))
  const userIsHost = parseInt(host_id, 10) === parseInt(user_id, 10)
  const isEventParticipant = event.event_users.find((u) => u.user.id === user_id)

  return (
    <>
      <EventStatusRedirect isEventParticipant={isEventParticipant} event={event} />
      {!isEventParticipant && event_status !== 'not-started' && event_status !== 'complete' ? (
        <JoinEventBanner />
      ) : null}
      <EventPhotoBanner
        bannerPhotoURL={banner_photo_url}
        eventId={eventId}
        userIsHost={userIsHost}
      />
      <Grid
        container
        direction="column"
        justify="flex-start"
        className={classes.eventContentContainer}
      >
        <EventTitleAndCTACard event={event} user={user} eventId={eventId} />
        <HostAndEventDescCard event={event} userIsHost={userIsHost} />
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
            {userIsHost ? <EventRSVPsCard eventUsers={event_users} /> : <PodcastCard />}
          </Grid>
        </Grid>
        {userIsHost ? (
          <Grid container direction="row" justify="space-between">
            <div className={classes.whatToExpectContainer}>
              <AboutTheHostCard host={host} userIsHost={userIsHost} />
            </div>
            <div className={classes.podcastContainer}>
              <PodcastCard />
            </div>
          </Grid>
        ) : (
          <Grid container direction="row" justify="flex-start">
            <div className={classes.whatToExpectContainer}>
              <AboutTheHostCard host={host} userIsHost={userIsHost} />
            </div>
          </Grid>
        )}
      </Grid>
    </>
  )
}

export default Event
