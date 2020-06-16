import React, { useEffect } from 'react'

import { Typography, Grid } from '@material-ui/core'
import ScheduleIcon from '@material-ui/icons/Schedule'
import { makeStyles } from '@material-ui/styles'

import { useHistory } from 'react-router-dom'
import bannerBackground from '../assets/eventBannerMountain.png'
import { AdminPanel, UserPanel, Loading } from '../common'
import { useAppContext } from '../context/useAppContext'
import formatDate from '../utils/formatDate'

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
    marginLeft: '5px',
  },
}))

const Event = ({ match }) => {
  const history = useHistory()
  const { id: eventId } = match.params
  const classes = useStyles()
  const { app, user, event, setEventId } = useAppContext()
  const { appLoading } = app
  const { userId } = user
  const eventSet = Object.keys(event).length > 1

  // used as a safety check for when we get thumbs up data
  localStorage.setItem('eventId', eventId)

  useEffect(() => {
    if (!Object.keys(event).length && eventId) {
      setEventId(parseInt(eventId, 10))
    }
  }, [eventId])

  useEffect(() => {
    if (eventSet && event.status === 'room-in-progress' && userId) {
      const isEventParticipant = event.event_users.find((user) => user.user.id === userId)
      if (isEventParticipant) {
        return history.push(`/events/${eventId}/video-room`)
      }
    }
    if (eventSet && event.status === 'complete' && userId) {
      const isEventParticipant = event.event_users.find((user) => user.user.id === userId)
      if (isEventParticipant) {
        return history.push(`/events/${eventId}/event-complete`)
      }
    }
  }, [event])

  if (appLoading || Object.keys(event).length < 2) {
    return <Loading />
  }

  const { host_id, start_at, event_name } = event
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
              <ScheduleIcon className={classes.scheduleIcon} />
              <Typography className={classes.subtitle} variant="subtitle1">
                {formatDate(startTime)}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </div>
      {parseInt(host_id, 10) === parseInt(userId, 10) ? (
        <AdminPanel timeState={timeState()} eventData={event} />
      ) : (
        <UserPanel timeState={timeState()} eventData={event} />
        // <UserPanel timeState={timeState()} eventData={event} refetch={refetch} />
      )}
    </>
  )
}

export default Event
