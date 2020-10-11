import React, { useEffect, useRef } from 'react'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/styles'

import bannerBackground from '../../assets/eventBannerMountain.png'
import {
  AdminPanel,
  UserPanel,
  EventStatusRedirect,
  EventCantRSVP,
  EventTitleAndCTACard,
  HostAndEventDescCard,
  PodcastCard,
} from '.'
import { Loading } from '../../common'
import { useAppContext, useEventContext, useUserContext } from '../../context'
import { getTimeUntilEvent } from '../../utils'
import { useGetCameraAndMicStatus } from '../../hooks'

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
    marginBottom: '80px',
  },
  eventContentContainer: {
    position: 'relative',
    zIndex: '99',
    width: '75vw',
    maxWidth: '1560px',
    margin: theme.spacing(-20, 'auto', 0, 'auto'),
  },
  subtitle: {
    margin: theme.spacing(1),
    marginBottom: '10px',
    width: '75%',
    [theme.breakpoints.down('sm')]: {
      width: '90%',
    },
  },
  whatToExpectAndPodcastContainer: {
    marginTop: theme.spacing(2),
  },
}))

const Event = ({ match }) => {
  const { id: eventId } = match.params
  const classes = useStyles()
  const { appLoading } = useAppContext()
  const { user } = useUserContext()
  const { permissions, event, setEventId } = useEventContext()
  const { id: userId } = user
  const { host_id, start_at, description, status: eventStatus } = event
  const eventSet = Object.keys(event).length > 1
  const hasCheckedCamera = useRef()
  const micOrCameraIsDisabled = Object.values(permissions).indexOf(false) > -1
  useGetCameraAndMicStatus(hasCheckedCamera.current)
  hasCheckedCamera.current = true
  // used as a safety check for when we get thumbs up data
  localStorage.setItem('eventId', eventId)

  useEffect(() => {
    if (!Object.keys(event).length && eventId) {
      setEventId(parseInt(eventId, 10))
    }
  }, [eventId, event, setEventId])

  // clean up this check?
  if (appLoading || Object.keys(event).length < 2) {
    return <Loading />
  }

  const isEventParticipant = event.event_users.find((u) => u.user.id === userId)

  const timeUntilEvent = getTimeUntilEvent(start_at)

  const timeState = () => {
    if (timeUntilEvent > 1800000) {
      return 'future'
    }
    if (timeUntilEvent < 0) {
      return 'go time'
    }
    return 'within 30 mins'
  }

  let eventInstruction
  if (eventStatus === 'complete') {
    eventInstruction = <EventCantRSVP />
  } else {
    eventInstruction =
      parseInt(host_id, 10) === parseInt(userId, 10) ? (
        <AdminPanel timeState={timeState()} eventData={event} permissions={permissions} />
      ) : (
        <UserPanel timeState={timeState()} eventData={event} permissions={permissions} />
      )
  }

  return (
    <>
      <EventStatusRedirect
        isEventParticipant={isEventParticipant}
        micOrCameraIsDisabled={micOrCameraIsDisabled}
        userId={userId}
        eventSet={eventSet}
        event={event}
      />
      <div className={classes.eventBanner} />
      <div className={classes.bannerGradient} />
      <Grid
        container
        direction="column"
        justify="flex-start"
        className={classes.eventContentContainer}
      >
        <EventTitleAndCTACard event={event} user={user} />
        <HostAndEventDescCard event={event} />
        <Grid
          container
          direction="row"
          justify="space-between"
          className={classes.whatToExpectAndPodcastContainer}
        >
          <Grid item md={5}>
            <PodcastCard />
          </Grid>
        </Grid>
      </Grid>
      {eventInstruction}
    </>
  )
}

export default Event
