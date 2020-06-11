import React from 'react'

import { Typography, Grid } from '@material-ui/core'
import ScheduleIcon from '@material-ui/icons/Schedule'
import { makeStyles } from '@material-ui/styles'

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
  const { id } = match.params
  const classes = useStyles()
  const { app, user, event } = useAppContext()
  const { appLoading } = app
  const { userId } = user

  // used as a safety check for when we get thumbs up data
  localStorage.setItem('eventId', id)

  // useEffect(() => {
  //   if (!eventDataLoading && eventData.events && !event_users) {
  //     if (!eventData.events.length) {
  //       return history.push('/events')
  //     }

  //     const { event_users, ended_at } = eventData.events[0]

  //     if (ended_at) {
  //       return history.push('/event-complete')
  //     }
  //     if (currentRound > 0) {
  //       history.push('/video-room')
  //     }
  //     // setAttendees(event_users)
  //   }
  // }, [event, history, event_users, currentRound])

  if (appLoading) {
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
