import React, { useEffect, useState } from 'react'

import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/styles'
import { TextField, Button } from '@material-ui/core'

import bannerBackground from '../../assets/eventBannerMountain.png'
import {
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
import { getTimeUntilEvent } from '../../utils'

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
  changeBanner: {
    position: 'absolute',
    top: 15,
    left: 15,
    textTransform: 'lowercase',
    cursor: 'pointer',
    zIndex: 999,
  },
  input: {
    marginTop: theme.spacing(6),
    marginLeft: theme.spacing(2),
  },
  bannerSearchContainer: {
    background: 'rgba(0,0,0,.3)',
    position: 'absolute',
    zIndex: 999,
    width: '50%',
  },
}))

const Event = ({ match }) => {
  const { id: eventId } = match.params
  const classes = useStyles()
  const { appLoading } = useAppContext()
  const { user } = useUserContext()
  const { event, setEventId } = useEventContext()
  const { id: user_id } = user
  const { event_users, host_id, start_at, status: event_status } = event
  const eventSet = Object.keys(event).length > 1
  const [showBannerSearch, setShowBannerSearch] = useState(null)
  const [bannerSearchTerm, setBannerSearchTerm] = useState(null)
  const [randomImage, setRandomImage] = useState(null)

  useEffect(() => {
    if (!Object.keys(event).length && eventId) {
      setEventId(parseInt(eventId, 10))
    }
  }, [eventId, event, setEventId])

  // clean up this check?
  if (appLoading || Object.keys(event).length < 2) {
    return <Loading />
  }

  localStorage.setItem('eventId', eventId)
  localStorage.setItem('event', JSON.stringify(event))
  const userIsHost = parseInt(host_id, 10) === parseInt(user_id, 10)
  const isEventParticipant = event.event_users.find((u) => u.user.id === user_id)

  const timeUntilEvent = getTimeUntilEvent(start_at)

  const searchUnsplash = async (keyword) => {
    try {
      await fetch(`${process.env.REACT_APP_API_URL}/get-unsplash-image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ keyword }),
      })
        .then((response) => response.json())
        .then((data) => {
          setRandomImage(data.image)
          console.log('Event -> data', data.image.urls.full)
        })
    } catch (error) {
      alert('error seraching for image')
    }
  }

  return (
    <>
      <EventStatusRedirect
        isEventParticipant={isEventParticipant}
        userId={user_id}
        eventSet={eventSet}
        event={event}
      />
      {!isEventParticipant && event_status !== 'not-started' && event_status !== 'complete' ? (
        <JoinEventBanner />
      ) : null}
      <Grid container style={{ position: 'relative' }}>
        <Button
          className={classes.changeBanner}
          size="small"
          variant="primary"
          onClick={() => setShowBannerSearch(true)}
        >
          change banner
        </Button>
        {showBannerSearch && (
          <Grid direction="column" justify="flex-start" className={classes.bannerSearchContainer}>
            <TextField
              id="banner search term"
              label="banner search term"
              required
              fullWidth
              className={classes.input}
              value={bannerSearchTerm}
              onChange={(e) => setBannerSearchTerm(e.target.value)}
            />
            <Button size="small" variant="primary" onClick={() => searchUnsplash(bannerSearchTerm)}>
              {randomImage ? 'serach again' : 'search'}
            </Button>
          </Grid>
        )}
        <div
          className={classes.eventBanner}
          style={{
            background: randomImage
              ? `url("${randomImage.urls.full}")`
              : `url("${bannerBackground}")`,
          }}
        />
        <div className={classes.bannerGradient} />
      </Grid>
      {/* <Grid container>
        <div className={classes.eventBanner} />
      </Grid> */}
      <Grid
        container
        direction="column"
        justify="flex-start"
        className={classes.eventContentContainer}
      >
        <EventTitleAndCTACard event={event} user={user} />
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
          <Grid container direction="row" justify="flex-end">
            <div className={classes.podcastContainer}>
              <PodcastCard />
            </div>
          </Grid>
        ) : null}
      </Grid>
    </>
  )
}

export default Event
