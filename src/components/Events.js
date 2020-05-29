import React from 'react'

import { useQuery } from '@apollo/react-hooks'
import { Redirect } from 'react-router-dom'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'
import { makeStyles } from '@material-ui/core/styles'
import { EventCard, Loading } from '../common'
import { useGameContext } from '../context/useGameContext'
import bannerBackground5 from '../assets/purpleOil.jpg'
import { CreateEventButton } from '.'

const useStyles = makeStyles((theme) => ({
  eventsContainer: {
    marginTop: '2em',
    marginBottom: '2em',
  },
  cardContainer: {
    maxWidth: 500,
  },
  pageBanner: {
    width: '100%',
    height: '45vh',
    paddingBottom: '80px',
    backgroundImage: `url(${bannerBackground5})`,
    backgroundPosition: '50% 50%',
    backgroundSize: 'cover',
    zIndex: '-2',
  },
  pageBannerContentContainer: {
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '50%',
    textAlign: 'center',
  },
  pageHeader: {
    ...theme.typography.h1,
    fontSize: '3rem',
  },
  scheduleIcon: {
    color: theme.palette.common.ghostWhite,
  },
  subtitle: {
    fontSize: '1.2rem',
  },
}))
const Events = () => {
  const classes = useStyles()

  const { appLoading, userId, role, userEventsData, hostEventsData } = useGameContext()

  if (appLoading) {
    return <Loading />
  }

  if (!userId) {
    return <Redirect to="/" push />
  }

  if (!userEventsData && !hostEventsData) {
    return <div>no events data </div>
  }
  // console.log('events = ', userEventsData)
  // const sortedEvents = userEventsData.events.sort((a, b) => {
  //   // write logic here to sort events by start time
  // })

  // we could (and probably should) loop over hosts data and user's
  // events data separately
  const renderUserCards = () =>
    role === 'user' &&
    userEventsData.event_users.map((event) => {
      return <EventCard key={event.id} event={event.event} />
    })

  const renderHostCards = () =>
    role === 'host' &&
    hostEventsData.events.map((event) => {
      return <EventCard key={event.id} event={event} />
    })

  return (
    <>
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="center"
        className={classes.pageBanner}
      >
        <Grid item container direction="column" className={classes.pageBannerContentContainer}>
          <Typography className={classes.pageHeader}>Find a community for you</Typography>
          <Typography className={classes.subtitle} variant="subtitle1">
            Scroll through our events and start video-chatting with awesome people.
          </Typography>
        </Grid>
      </Grid>
      {role === 'host' && <CreateEventButton />}
      {renderUserCards()}
      {renderHostCards()}
    </>
  )
}

export default Events

// <Grid container direction="column" alignItems="center">

//           <Grid item>
//             <Typography variant="h4">Your Upcoming Events:</Typography>
//           </Grid>
//           <Grid item className={classes.eventsContainer}>
//             {eventsData.events.map((event) => (
//               <EventCard key={event.id} event={event} />
//             ))}
//           </Grid>
//         </Grid>
