import React from 'react'

import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import { Redirect, useHistory } from 'react-router-dom'

import { CreateEventButton } from '.'
import bannerBackground5 from '../assets/purpleOil.jpg'
import { EventCard, Loading } from '../common'
import { useGameContext } from '../context/useGameContext'

const useStyles = makeStyles((theme) => ({
  eventsContainer: {
    marginTop: '2em',
    marginBottom: '2em',
  },
  cardContainer: {
    maxWidth: 500,
  },
  bannerGradient: {
    background: ' rgb(25,25,25)',
    background:
      'linear-gradient(0deg, rgba(25,25,25,1) 0%, rgba(0,0,0,0) 58%, rgba(0,212,255,0) 100%)',
    width: '100%',
    height: '100%',
  },
  pageBanner: {
    width: '100%',
    height: '45vh',
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

  const { appLoading, userId, role, eventsData } = useGameContext()
  if (appLoading) {
    return <Loading />
  }

  if (!userId) {
    return <Redirect to="/" />
  }

  if (!eventsData) {
    return (
      <>
        <div>No events yet!</div>
        {role === 'host' && <CreateEventButton />}
      </>
    )
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
            <Typography className={classes.pageHeader}>Find a community for you</Typography>
            <Typography className={classes.subtitle} variant="subtitle1">
              Scroll through our events and start video-chatting with awesome people.
            </Typography>
          </Grid>
        </Grid>
      </div>
      {role === 'host' && <CreateEventButton />}
      {eventsData.event_users.map(({ event }) => {
        return <EventCard key={event.id} event={event} />
      })}
    </>
  )
}

export default Events
