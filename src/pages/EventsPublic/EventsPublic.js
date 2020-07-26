import React, { useEffect } from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { useQuery } from '@apollo/react-hooks'
import { makeStyles } from '@material-ui/core/styles'
import { useHistory } from 'react-router-dom'
import { getAllPublicEvents } from '../../gql/queries'
import bannerBackground5 from '../../assets/purpleOil.jpg'
import { EventCard, Loading } from '../../common'

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
}))

const EventsPublic = () => {
  const classes = useStyles()
  const history = useHistory()

  const { data: allPublicEventsData, loading: allPublicEventsDataLoading } = useQuery(
    getAllPublicEvents,
    {}
  )

  useEffect(() => {
    localStorage.setItem('eventId', '')
  }, [])

  if (allPublicEventsDataLoading) {
    return <Loading />
  }

  console.log(allPublicEventsData.events)

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
      {allPublicEventsData &&
        allPublicEventsData.events.map((event) => {
          console.log('event', event)
          return <EventCard key={event.id} event={event} />
        })}
    </>
  )
}

export default EventsPublic
