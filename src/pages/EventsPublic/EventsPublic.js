import React, { useEffect } from 'react'
import { useQuery } from '@apollo/react-hooks'
import { Grid, Typography } from '@material-ui/core'
import { useEventsPublicStyles } from '.'
import { FloatCardLarge, EventCard, Loading } from '../../common'
import { getAllPublicEvents } from '../../gql/queries'
import { getEventStartedOver24HoursAgo } from '../../utils'

const EventsPublic = () => {
  const classes = useEventsPublicStyles()

  const {
    data: allPublicEventsData,
    loading: allPublicEventsDataLoading,
  } = useQuery(getAllPublicEvents, { fetchPolicy: 'no-cache' })

  useEffect(() => {
    localStorage.setItem('eventId', '')
    localStorage.setItem('event', '')
    // TODO instead of setting eventId null, we should reset to initial state somewhere on a cleanup function
  }, [])

  if (allPublicEventsDataLoading) {
    return <Loading />
  }

  const renderNullDataText = (message) => {
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
            <Typography variant="h4" className={classes.nullDataHeader}>
              {message}
            </Typography>
          </Grid>
        </FloatCardLarge>
      </>
    )
  }

  const renderEventsCards = () => {
    if (allPublicEventsData?.events.length) {
      const group = allPublicEventsData.events
        .filter((event) => {
          const eventStartedOver24HoursAgo = getEventStartedOver24HoursAgo(event.start_at)
          return !event.ended_at && !eventStartedOver24HoursAgo
        })
        .sort((eventA, eventB) => {
          if (eventA && eventB) {
            if (Date.parse(eventB.start_at) < Date.parse(eventA.start_at)) {
              return 1
            }
          }
          return -1
        })

      if (group.length > 0) {
        return group.map((event) => (
          <div style={{ marginBottom: '75px' }}>
            <EventCard key={event.id} event={event} />
          </div>
        ))
      }
      return renderNullDataText('No upcoming events 😢')
    }
    return renderNullDataText('No upcoming events 😢')
  }

  return (
    <>
      <Grid container>
        <Grid
          container
          direction="column"
          justify="flex-end"
          alignItems="center"
          className={classes.eventsPublicPageBanner}
        >
          <Grid
            item
            container
            direction="column"
            className={classes.eventsPublicPageBannerContentContainer}
          >
            <Typography variant="h1">Public Events</Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid container direction="column" justify="center" alignItems="center">
        {renderEventsCards()}
      </Grid>
    </>
  )
}

export default EventsPublic
