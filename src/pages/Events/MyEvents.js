import React, { useEffect } from 'react'
import { useQuery } from '@apollo/react-hooks'
import { Redirect, useHistory } from 'react-router-dom'
import { Button, Grid, Typography } from '@material-ui/core'

import { useEventsStyles } from '.'
import { EventCard, Loading, FloatCardLarge } from '../../common'
import { useAppContext, useEventContext, useUserContext } from '../../context'
import { getEventsByUserId } from '../../gql/queries'

const MyEvents = () => {
  const classes = useEventsStyles()
  const history = useHistory()
  const { user } = useUserContext()
  const { appLoading } = useAppContext()
  const { resetEvent, setEventId } = useEventContext()
  const { id: userId } = user

  const { data: eventsData, loading: eventsLoading } = useQuery(getEventsByUserId, {
    variables: {
      userId: userId,
    },
    skip: !userId,
  })

  useEffect(() => {
    resetEvent()
    // TODO instead of setting eventId null, we should reset to initial state somewhere on a cleanup function
    setEventId(null)
    localStorage.setItem('eventId', '')
    localStorage.setItem('event', '')
  }, [])

  if (appLoading || eventsLoading) {
    return <Loading />
  }

  if (!userId) {
    return <Redirect to="/" />
  }

  const handleGoToPublicEventsClick = () => {
    return history.push('/events')
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
                Sorry, we are currently mostly hosting invite-only events{' '}
                <span role="img" aria-label="neutral face">
                  😐
                </span>
              </Typography>
              <Typography variant="body1" className={classes.nullDataSub}>
                If you know someone who is hosting an event they can give you their shareable link!
              </Typography>
              <Typography variant="body1" className={classes.nullDataSub}>
                Or take a gander through our limited public events.
              </Typography>
              <Button
                onClick={handleGoToPublicEventsClick}
                color="primary"
                variant="contained"
                style={{ marginTop: '20px' }}
              >
                Take Me There!
              </Button>
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
              <div style={{ marginBottom: '75px' }}>
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
              <div style={{ marginBottom: '75px' }}>
                <EventCard key={event.id} event={event} />
              </div>
            )
          })}
      </Grid>
    </>
  )
}

export default MyEvents
