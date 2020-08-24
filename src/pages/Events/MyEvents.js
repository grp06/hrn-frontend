import React, { useEffect } from 'react'

import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import { Redirect, useHistory } from 'react-router-dom'
import { useQuery } from '@apollo/react-hooks'

import { EventCard, Loading, FloatCardLarge } from '../../common'
import { useAppContext, useUserContext } from '../../context'
import { getEventsByUserId } from '../../gql/queries'
import bannerBackground5 from '../../assets/purpleOil.jpg'

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
  nullDataContainer: {
    padding: theme.spacing(5),
  },
  nullDataHeader: {
    marginBottom: theme.spacing(4),
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
  const { id: userId } = user

  const { data: eventsData, loading: eventsLoading } = useQuery(getEventsByUserId, {
    variables: {
      userId: userId,
    },
    skip: !userId,
  })

  useEffect(() => {
    localStorage.setItem('eventId', '')
  }, [])

  if (!userId) {
    return <Redirect to="/" />
  }

  if (appLoading || eventsLoading) {
    return <Loading />
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
              <Typography variant="h4" className={classes.nullDataHeader}>
                Sorry, we are currently mostly hosting invite-only events{' '}
                <span role="img" aria-label="neutral face">
                  😐
                </span>
              </Typography>
              <Typography variant="h6" className={classes.nullDataSub}>
                If you know someone who is hosting an event they can give you their shareable link!
              </Typography>
              <Typography variant="h6" className={classes.nullDataSub}>
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
      <div className={classes.pageBanner}>
        <Grid
          container
          direction="column"
          justify="center"
          alignItems="center"
          className={classes.bannerGradient}
        >
          <Grid item container direction="column" className={classes.pageBannerContentContainer}>
            <Typography variant="h3">My Events</Typography>
          </Grid>
        </Grid>
      </div>
      {renderNullDataText()}
      {eventsData &&
        eventsData.event_users
          .sort((eventA, eventB) => {
            if (eventA && eventB) {
              return eventA.event.start_at > eventB.event.start_at
            }
          })
          .map(({ event }) => {
            return <EventCard key={event.id} event={event} />
          })}
    </>
  )
}

export default MyEvents
