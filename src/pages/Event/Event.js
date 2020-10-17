import React, { useEffect, useRef } from 'react'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import FeatherIcon from 'feather-icons-react'
import { makeStyles } from '@material-ui/styles'

import bannerBackground from '../../assets/eventBannerMountain.png'
import { AdminPanel, UserPanel, EventStatusRedirect, EventNotRSVP } from '.'
import { Loading } from '../../common'
import { useAppContext, useEventContext, useUserContext } from '../../context'
import { formatDate, getTimeUntilEvent } from '../../utils'

const useStyles = makeStyles((theme) => ({
  bannerGradient: {
    background:
      'linear-gradient(0deg, rgba(25,25,25,1) 0%, rgba(0,0,0,0) 58%, rgba(0,212,255,0) 100%)',
    width: '100%',
    height: '100%',
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
  eventBannerContentContainer: {
    paddingTop: '40vh',
    marginLeft: '30px',
  },
  subtitle: {
    margin: theme.spacing(1),
    marginBottom: '10px',
    width: '75%',
    [theme.breakpoints.down('sm')]: {
      width: '90%',
    },
  },
}))

const Event = ({ match }) => {
  const { id: eventId } = match.params
  const classes = useStyles()
  const { appLoading } = useAppContext()
  const { user } = useUserContext()
  const { event, setEventId } = useEventContext()
  const { id: userId } = user
  const eventSet = Object.keys(event).length > 1
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

  const { host_id, start_at, event_name, description, status: eventStatus } = event
  const startTime = new Date(start_at).getTime()
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
    eventInstruction = <EventNotRSVP />
  } else {
    eventInstruction =
      parseInt(host_id, 10) === parseInt(userId, 10) ? (
        <AdminPanel timeState={timeState()} eventData={event} />
      ) : (
        <UserPanel timeState={timeState()} eventData={event} />
      )
  }

  return (
    <>
      <EventStatusRedirect
        isEventParticipant={isEventParticipant}
        userId={userId}
        eventSet={eventSet}
        event={event}
      />
      <div className={classes.eventBanner}>
        <Grid container direction="column" justify="flex-end" className={classes.bannerGradient}>
          <Grid
            item
            container
            direction="column"
            justify="flex-start"
            md={12}
            xs={12}
            className={classes.eventBannerContentContainer}
          >
            <Typography variant="h3">{event_name}</Typography>
            <Grid item container direction="row" alignItems="center">
              <FeatherIcon icon="calendar" stroke="#e98dd7" size="24" />
              <Typography variant="subtitle1" className={classes.subtitle}>
                {formatDate(startTime)}
              </Typography>
            </Grid>
            <Grid item container direction="row" alignItems="center">
              <Typography variant="subtitle1" className={classes.subtitle}>
                {description}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </div>
      {eventInstruction}
    </>
  )
}

export default Event
