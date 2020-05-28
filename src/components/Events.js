import React from 'react'

import { useQuery } from '@apollo/react-hooks'
import { Redirect } from 'react-router-dom'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'
import { makeStyles } from '@material-ui/core/styles'
import { EventCard, Loading } from '../common'
import { useGameContext } from '../context/useGameContext'
import { getEventsByUserId } from '../gql/queries'
import { CreateEventButton } from '.'

const useStyles = makeStyles((theme) => ({
  eventsContainer: {
    marginTop: '2em',
    marginBottom: '2em',
  },
  cardContainer: {
    maxWidth: 500,
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
      console.log('event = ', event)
      return <EventCard key={event.id} event={event} />
    })

  return (
    <Container>
      <Grid container direction="column" alignItems="center">
        {role === 'host' && <CreateEventButton />}
        <Grid item>
          <Typography variant="h4">Your Upcoming Events:</Typography>
        </Grid>
        <Grid item className={classes.eventsContainer}>
          {renderUserCards()}
          {renderHostCards()}
        </Grid>
      </Grid>
    </Container>
  )
}

export default Events
