import React, { useEffect, useState } from 'react'

import { useQuery } from '@apollo/react-hooks'
import { Typography, Grid } from '@material-ui/core'
import ScheduleIcon from '@material-ui/icons/Schedule'
import { makeStyles } from '@material-ui/styles'
import { useHistory } from 'react-router-dom'

import bannerBackground from '../assets/ethan-banner.jpg'
import { AdminPanel, UserPanel, Loading } from '../common'
import { useGameContext } from '../context/useGameContext'
import { getEventById } from '../gql/queries'
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
  const { id } = match.params
  const classes = useStyles()
  const {
    appLoading,
    userId,
    currentRound,
    setAttendees,
    setEventId,
    eventId,
    attendees,
    eventsData: allEventsOfThisUser,
  } = useGameContext()
  const history = useHistory()

  const { data: eventData, loading: eventDataLoading, error: eventError, refetch } = useQuery(
    getEventById,
    {
      variables: {
        event_id: id,
      },
    }
  )

  // used as a safety check for when we get thumbs up data
  localStorage.setItem('eventId', id)

  useEffect(() => {
    if (!eventId) {
      setEventId(parseInt(id, 10))
    }
  }, [eventId, id, setEventId])

  useEffect(() => {
    if (!eventDataLoading && eventData.events && !attendees) {
      if (!eventData.events.length) {
        return history.push('/events')
      }
      const { event_users } = eventData.events[0]

      setAttendees(event_users)
    }
  }, [eventData, eventDataLoading, history, setAttendees, attendees])

  useEffect(() => {
    if (currentRound > 0) {
      history.push('/video-room')
    }
  }, [currentRound, history])

  if (appLoading || eventDataLoading || !eventData.events.length) {
    return <Loading />
  }

  if (!eventData) {
    return null
  }

  if (eventError) {
    return <div>Sorry, we encountered an error. Refresh?</div>
  }

  const currentEvent = allEventsOfThisUser.event_users.find((event) => event.event.id == id)
  const { event_name, host_id: hostId } = currentEvent.event

  const event = eventData.events[0]

  const startTime = new Date(event.start_at).getTime()
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
      {parseInt(hostId, 10) === parseInt(userId, 10) ? (
        <AdminPanel timeState={timeState()} eventData={eventData} />
      ) : (
        <UserPanel timeState={timeState()} eventData={eventData} refetch={refetch} />
      )}
    </>
  )
}

export default Event
