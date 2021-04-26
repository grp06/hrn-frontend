import React, { useEffect } from 'react'
import { useQuery } from '@apollo/react-hooks'
import { Redirect, useHistory } from 'react-router-dom'
import { Button, Grid, Typography } from '@material-ui/core'

import { useEventsStyles } from '.'
import { EventCard, Loading, FloatCardLarge } from '../../common'
import { useUserContext } from '../../context'
import { getEventsByUserId } from '../../gql/queries'

const MyEvents = () => {
  const classes = useEventsStyles()
  const history = useHistory()
  const { user, userContextLoading } = useUserContext()
  const { id: userId } = user

  const { data: eventsData, loading: eventsLoading } = useQuery(getEventsByUserId, {
    variables: {
      userId: userId,
    },
    skip: !userId,
  })

  useEffect(() => {
    // TODO instead of setting eventId null, we should reset to initial state somewhere on a cleanup function
    localStorage.setItem('eventId', '')
    localStorage.setItem('event', '')
    localStorage.setItem('twoSidedSide', '')
  }, [])

  if (userContextLoading || eventsLoading) {
    return <Loading />
  }

  if (!userId) {
    return <Redirect to="/" />
  }

  const renderNullDataText = () => {
    if (!eventsData || !eventsData.event_users.length) {
      return (
        <>
          <FloatCardLarge>
            <Grid
              container
              direction="column"
              justify="center"
              alignItems="center"
              className={classes.nullDataContainer}
            >
              <Typography variant="h3" className={classes.nullDataHeader}>
                No events to see. You should create one!
                <span role="img" aria-label="neutral face">
                  🙂
                </span>
              </Typography>
            </Grid>
          </FloatCardLarge>
        </>
      )
    }
  }

  return (
    <>
      <Grid container>
        <Grid
          container
          direction="column"
          justify="flex-end"
          alignItems="center"
          className={classes.eventsPageBanner}
        >
          <Grid
            item
            container
            direction="column"
            className={classes.eventsPageBannerContentContainer}
          >
            <Typography variant="h1">My Events</Typography>
          </Grid>
        </Grid>
      </Grid>
      {renderNullDataText()}
      <Grid container direction="column" justify="center" alignItems="center">
        {eventsData?.event_users
          .filter((event) => {
            return !event.event.ended_at
          })
          .sort((eventA, eventB) => {
            if (eventA && eventB) {
              return Date.parse(eventA.event.start_at) - Date.parse(eventB.event.start_at)
            }
          })
          .map(({ event }) => {
            return (
              <div key={event.id} style={{ marginBottom: '75px' }}>
                <EventCard key={event.id} event={event} />
              </div>
            )
          })}
        {eventsData?.event_users
          .filter((event) => {
            return event.event.ended_at
          })
          .sort((eventA, eventB) => {
            if (eventA && eventB) {
              return Date.parse(eventB.event.start_at) - Date.parse(eventA.event.start_at)
            }
          })
          .map(({ event }) => {
            return (
              <div key={event.id} style={{ marginBottom: '75px' }}>
                <EventCard key={event.id} event={event} />
              </div>
            )
          })}
      </Grid>
    </>
  )
}

export default MyEvents
