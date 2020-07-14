import React, { useEffect, useRef } from 'react'

import { Typography, Grid } from '@material-ui/core'
import ScheduleIcon from '@material-ui/icons/Schedule'
import { makeStyles } from '@material-ui/styles'

import FeatherIcon from 'feather-icons-react'
import { useHistory } from 'react-router-dom'
import bannerBackground from '../assets/eventBannerMountain.png'
import { AdminPanel, UserPanel, Loading } from '../common'
import { useAppContext } from '../context/useAppContext'
import formatDate from '../utils/formatDate'
import { useGetCameraAndMicStatus } from '../hooks'

const useStyles = makeStyles((theme) => ({
  bannerGradient: {
    background: ' rgb(25,25,25)',
    background:
      'linear-gradient(0deg, rgba(25,25,25,1) 0%, rgba(0,0,0,0) 58%, rgba(0,212,255,0) 100%)',
    width: '100%',
    height: '100%',
  },
  eventBanner: {
    width: '100%',
    height: '55vh',
    backgroundImage: `url(${bannerBackground})`,
    backgroundPosition: '50% 50%',
    backgroundSize: 'cover',
    zIndex: '-3',
    marginBottom: '80px',
  },
  eventBannerContentContainer: {
    marginLeft: '30px',
  },
  eventTitle: {
    ...theme.typography.h1,
  },
  scheduleIcon: {
    color: theme.palette.common.ghostWhite,
  },
  subtitle: {
    margin: theme.spacing(1),
    width: '50%',
  },
}))

const Event = ({ match }) => {
  const history = useHistory()
  const { id: eventId } = match.params
  const classes = useStyles()
  const { app, user, event, setEventId } = useAppContext()
  const { appLoading, permissions } = app
  const { userId } = user
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

  useEffect(() => {
    if (eventSet && userId) {
      const isEventParticipant = event.event_users.find((u) => u.user.id === userId)
      if (isEventParticipant && !micOrCameraIsDisabled) {
        switch (event.status) {
          case 'pre-event':
            return history.push(`/events/${eventId}/pre-event`)
          case 'room-in-progress':
            return history.push(`/events/${eventId}/video-room`)
          case 'complete':
            return history.push(`/events/${eventId}/event-complete`)
          default:
            break
        }
      }
    }
  }, [event, userId, eventId, eventSet, history])

  // clean up this check?
  if (appLoading || Object.keys(event).length < 2) {
    return <Loading />
  }

  const { host_id, start_at, event_name, description } = event
  const startTime = new Date(start_at).getTime()
  const now = Date.now()
  const diff = startTime - now

  const timeState = () => {
    if (diff > 1800000) {
      return 'future'
    }
    if (diff < 0) {
      return 'go time'
    }
    return 'within 30 mins'
  }

  return (
    <>
      <div className={classes.eventBanner}>
        <Grid container direction="column" justify="flex-end" className={classes.bannerGradient}>
          <Grid item container direction="column" className={classes.eventBannerContentContainer}>
            <Typography className={classes.eventTitle}>{event_name}</Typography>
            <Grid item container direction="row" alignItems="center">
              <FeatherIcon icon="calendar" stroke="#e98dd7" size="24" />
              <Typography className={classes.subtitle} variant="subtitle1">
                {formatDate(startTime)}
              </Typography>
            </Grid>
            <Grid item container direction="row" alignItems="center">
              <Typography className={classes.subtitle} variant="subtitle1">
                {description}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </div>
      {parseInt(host_id, 10) === parseInt(userId, 10) ? (
        <AdminPanel timeState={timeState()} eventData={event} permissions={permissions} />
      ) : (
        <UserPanel timeState={timeState()} eventData={event} permissions={permissions} />
      )}
    </>
  )
}

export default Event
