import React from 'react'

import { useQuery } from '@apollo/react-hooks'
import { Redirect } from 'react-router-dom'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'
import { makeStyles } from '@material-ui/core/styles'
import { EventCard, Loading } from '../common'
import { useGameContext } from '../context/useGameContext'
import { getEvents } from '../gql/queries'
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

  const { appLoading, userId, role } = useGameContext()

  const { data: eventsData, loading: eventsLoading, error: eventsError } = useQuery(getEvents)

  if (appLoading || eventsLoading) {
    return <Loading />
  }

  if (!userId) {
    return <Redirect to="/" push />
  }

  if (!eventsData) {
    return <div>no events data </div>
  }

  return (
    <Container>
      <Grid container direction="column" alignItems="center">
        {role === 'host' && <CreateEventButton />}
        <Grid item>
          <Typography variant="h4">Your Upcoming Events:</Typography>
        </Grid>
        <Grid item className={classes.eventsContainer}>
          {eventsData.events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </Grid>
      </Grid>
    </Container>
  )
}

export default Events
