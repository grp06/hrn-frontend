import React from 'react'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import { useHistory } from 'react-router-dom'
import ScheduleIcon from '@material-ui/icons/Schedule'
import PeopleIcon from '@material-ui/icons/People'
import formatDate from '../utils/formatDate'
import eventImage1 from '../assets/personBeach.jpg'
import eventImage2 from '../assets/personBook.jpg'
import eventImage3 from '../assets/personClimbing.jpg'
import eventImage4 from '../assets/personPhone.jpg'
import eventImage5 from '../assets/personSalon.png'

import { FloatCardWide } from '.'

const eventImages = [eventImage1, eventImage2, eventImage3, eventImage4, eventImage5]
// const imageToMount = eventImages[Math.floor(Math.random() * eventImages.length)]

const useStyles = makeStyles((theme) => ({
  eventContainer: {
    width: '100%',
  },
  eventImage: {
    width: '100%',
    height: '275px',
    borderRadius: '4px 0px 0px 4px',
    backgroundImage: `url(${eventImage4})`,
    backgroundPosition: '0% 50%',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
  },
  eventContentContainer: {
    width: '100%',
    height: '275px',
    padding: '20px',
  },
  icon: {
    color: theme.palette.common.ghostWhiteBody,
    marginTop: '4px',
    marginBottom: '4px',
  },
  subtitle: {
    marginLeft: '5px',
    color: theme.palette.common.orchid,
    fontWeight: '500',
  },
}))

const EventCard = ({ event }) => {
  const { description, event_name, id, start_at } = event

  const classes = useStyles()
  const history = useHistory()

  const eventTime = formatDate(start_at)
  return (
    <FloatCardWide>
      <Grid
        container
        justify="flex-start"
        wrap="wrap"
        className={classes.eventContainer}
        onClick={() => history.push(`/events/${id}`)}
      >
        <Grid item lg={4} md={12} className={classes.eventImage}>
          <div />
        </Grid>
        <Grid
          container
          item
          lg={8}
          md={12}
          direction="column"
          justify="space-between"
          alignItems="flex-start"
          className={classes.eventContentContainer}
        >
          <Typography gutterBottom variant="h4">
            {event_name}
          </Typography>
          <Typography variant="body1" component="p">
            {description}
          </Typography>
          <Grid item container direction="row" alignItems="center">
            <ScheduleIcon className={classes.icon} />
            <Typography className={classes.subtitle} variant="subtitle1">
              {eventTime}
            </Typography>
          </Grid>
          {/* <Grid item container direction="row" alignItems="center">
            <PeopleIcon className={classes.icon} />
            <Typography className={classes.subtitle} variant="subtitle1">
              3 people attending
            </Typography>
          </Grid> */}
        </Grid>
      </Grid>
    </FloatCardWide>
  )
}

export default EventCard
