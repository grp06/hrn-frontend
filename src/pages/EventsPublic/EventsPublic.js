import React, { useEffect } from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { useQuery } from '@apollo/react-hooks'
import { makeStyles } from '@material-ui/core/styles'
import { getAllPublicEvents } from '../../gql/queries'
import bannerBackground5 from '../../assets/purpleOil.jpg'
import { isEventInFuture } from '../../utils'
import { EventCard, Loading } from '../../common'
import { useAppContext } from '../../context/useAppContext'

const useStyles = makeStyles((theme) => ({
  eventsContainer: {
    marginTop: '2em',
    marginBottom: '2em',
  },
  cardContainer: {
    maxWidth: 500,
  },
  bannerGradient: {
    background:
      'linear-gradient(0deg, rgba(25,25,25,1) 0%, rgba(0,0,0,0) 58%, rgba(0,212,255,0) 100%)',
    width: '100%',
    height: '100%',
  },
  eventTitleContainer: {
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '50%',
    textAlign: 'center',
    padding: '0px 0px 35px 0px',
  },
  pageBanner: {
    width: '100%',
    height: '30vh',
    backgroundImage: `url(${bannerBackground5})`,
    backgroundPosition: '50% 50%',
    backgroundSize: 'cover',
    marginBottom: '40px',
  },
  pageBannerContentContainer: {
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '50%',
    textAlign: 'center',
  },
  purpleUnderline: {
    backgroundColor: theme.palette.common.dankPurp,
    height: '5px',
    width: '20%',
    margin: theme.spacing(1, 'auto'),
  },
}))

const EventsPublic = () => {
  const classes = useStyles()
  const { setEventId, resetEvent } = useAppContext()

  const { data: allPublicEventsData, loading: allPublicEventsDataLoading } = useQuery(
    getAllPublicEvents,
    {}
  )

  useEffect(() => {
    localStorage.setItem('eventId', '')
    localStorage.setItem('event', '')
    setEventId(null)
    resetEvent()
  }, [])

  if (allPublicEventsDataLoading) {
    return <Loading />
  }

  let HRNevents
  let otherEvents
  const EventPublicRegex = /^Hi\sRight\sNow/
  if (allPublicEventsData) {
    HRNevents = allPublicEventsData.events
      .filter(
        (event) => event.event_name.match(EventPublicRegex) && isEventInFuture(event.start_at)
      )
      .sort((eventA, eventB) => {
        if (eventA && eventB) {
          return Date.parse(eventB.start_at) - Date.parse(eventA.start_at)
        }
      })

    otherEvents = allPublicEventsData.events
      .filter(
        (event) => !event.event_name.match(EventPublicRegex) && isEventInFuture(event.start_at)
      )
      .sort((eventA, eventB) => {
        if (eventA && eventB) {
          return Date.parse(eventB.start_at) - Date.parse(eventA.start_at)
        }
      })
  }

  return (
    <>
      <div className={classes.pageBanner}>
        <Grid
          container
          direction="column"
          justify="center"
          alignItems="center"
          className={classes.bannerGradient}
        >
          <Grid item container direction="column" className={classes.pageBannerContentContainer}>
            <Typography variant="h3">Join the Party!</Typography>
          </Grid>
        </Grid>
      </div>
      <Grid item container direction="column" className={classes.eventTitleContainer}>
        <Typography variant="h4">Hi Right Now Events</Typography>
        <div className={classes.purpleUnderline} />
      </Grid>
      {HRNevents &&
        HRNevents.map((event) => {
          return <EventCard key={event.id} event={event} />
        })}
      <Grid item container direction="column" className={classes.eventTitleContainer}>
        <Typography variant="h4">All Events</Typography>
        <div className={classes.purpleUnderline} />
      </Grid>
      {otherEvents &&
        otherEvents.map((event) => {
          return <EventCard key={event.id} event={event} style={{ top: '0%' }} />
        })}
    </>
  )
}

export default EventsPublic
