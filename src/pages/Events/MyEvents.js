import React, { useEffect } from 'react'

import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import { Redirect, useHistory } from 'react-router-dom'
import { useQuery } from '@apollo/react-hooks'

import { EventCard, Loading, FloatCardLarge } from '../../common'
import { useAppContext, useEventContext, useUserContext } from '../../context'
import { getEventsByUserId } from '../../gql/queries'
import blurryBackground from '../../assets/blurryBackground.png'

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
    height: '30vh',
    backgroundImage: `url(${blurryBackground})`,
    backgroundPosition: '50% 50%',
    backgroundSize: 'cover',
    marginBottom: '40px',
  },
  pageBannerContentContainer: {
    margin: theme.spacing(0, 'auto', 1.5, 'auto'),
    width: '70%',
  },
  nullDataContainer: {
    padding: theme.spacing(5),
  },
  nullDataHeader: {
    marginBottom: theme.spacing(1),
    textAlign: 'center',
  },
  nullDataSub: {
    textAlign: 'center',
  },
}))

const MyEvents = () => {
  const classes = useStyles()
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
          className={classes.pageBanner}
        >
          <Grid item container direction="column" className={classes.pageBannerContentContainer}>
            <Typography variant="h1">My Events</Typography>
          </Grid>
        </Grid>
      </Grid>
      {renderNullDataText()}
      <Grid container direction="column" justify="center" alignItems="center">
        {eventsData &&
          eventsData.event_users
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
        {eventsData &&
          eventsData.event_users
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
