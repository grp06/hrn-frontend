import React, { useEffect } from 'react'

import { useQuery } from '@apollo/react-hooks'

import { makeStyles } from '@material-ui/styles'
import { Typography, Grid } from '@material-ui/core'
import ScheduleIcon from '@material-ui/icons/Schedule'
import { useHistory } from 'react-router-dom'
import { AdminPanel, UserPanel, Loading } from '../common'
import { useGameContext } from '../context/useGameContext'
import { getEventById } from '../gql/queries'
import bannerBackground from '../assets/eventBannerMountain.png'

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
    height: '45vh',
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
  const { id: eventId } = match.params
  const classes = useStyles()
  const { appLoading, userId, currentRound, setAttendees, setEventId, role } = useGameContext()
  const history = useHistory()

  // decoding thing here
  const { data: eventData, loading: eventDataLoading, error: eventError, refetch } = useQuery(
    getEventById,
    {
      variables: {
        event_id: eventId,
      },
    }
  )

  useEffect(() => {
    if (!eventDataLoading && eventData.events) {
      const { event_users: attendees } = eventData.events[0]
      if (!eventData.events[0]) {
        return history.push('/events')
      }
      setAttendees(attendees)
      setEventId(eventId)
    }
  }, [eventData])

  useEffect(() => {
    if (currentRound > 0) {
      history.push('/video-room')
    }
  }, [currentRound])

  if (appLoading || eventDataLoading || !role) {
    return <Loading />
  }

  if (!eventData) {
    return null
  }

  // probably need to move this into useEffect

  const event = eventData.events[0]
  // if a user navigates to an eventId that doesn't exist, push them to /events

  const startTime = new Date(event.start_at).getTime()
  const eventTime = formatDate(startTime)
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
  const hostId = eventData && eventData.events[0].host_id

  return (
    <>
      <div className={classes.eventBanner}>
        <Grid container direction="column" justify="flex-end" className={classes.bannerGradient}>
          <Grid item container direction="column" className={classes.eventBannerContentContainer}>
            <Typography className={classes.eventTitle}>{event.event_name}</Typography>
            <Grid item container direction="row" alignItems="center">
              <ScheduleIcon className={classes.scheduleIcon} />
              <Typography className={classes.subtitle} variant="subtitle1">
                {eventTime}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </div>
      {hostId === userId ? (
        <AdminPanel timeState={timeState()} eventData={eventData} />
      ) : (
        <UserPanel timeState={timeState()} eventData={eventData} refetch={refetch} />
      )}
    </>
  )
}

export default Event
