import React from 'react'

import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import { useHistory } from 'react-router-dom'
import ScheduleIcon from '@material-ui/icons/Schedule'
import { formatDate, truncateText } from '../utils'
import eventImage from '../assets/globeMask.png'

import { FloatCardMediumLarge } from '.'

const useStyles = makeStyles((theme) => ({
  eventContainer: {
    width: '100%',
    position: 'relative',
  },
  eventEndedOverlay: {
    position: 'absolute',
    left: '0%',
    right: '0%',
    top: '0%',
    bottom: '0%',
    zIndex: 9,
    width: '100%',
    height: '100%',
    backgroundImage: 'linear-gradient(180deg, rgba(0,0,0,0.5), rgba(0,0,0,0.5))',
  },
  eventImage: {
    cursor: 'pointer',
    width: '100%',
    height: '275px',
    borderRadius: '4px 0px 0px 4px',
    backgroundImage: `url(${eventImage})`,
    backgroundPosition: '50% 50%',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
  },
  eventContentContainer: {
    cursor: 'pointer',
    width: '100%',
    height: '275px',
    padding: '20px',
    [theme.breakpoints.down('sm')]: {
      height: 'auto',
    },
  },
  icon: {
    color: theme.palette.common.ghostWhiteBody,
    margin: theme.spacing(0.5, 0),
  },
  subtitle: {
    marginLeft: theme.spacing(0.5),
    color: theme.palette.common.basePink,
    fontWeight: '500',
  },
  eventOverButton: {
    position: 'relative',
    zIndex: 10,
  },
}))

const EventCard = ({ event }) => {
  const { description, event_name, id, start_at, ended_at } = event
  const classes = useStyles()
  const history = useHistory()

  const eventTime = formatDate(start_at)

  const handleEventOverButtonClick = () => {
    history.push(`/events/${id}`)
  }

  return (
    <FloatCardMediumLarge>
      <Grid
        container
        justify="flex-start"
        wrap="wrap"
        className={classes.eventContainer}
        onClick={() => {
          if (!ended_at) {
            history.push(`/events/${id}`)
          }
        }}
      >
        {ended_at && <div className={classes.eventEndedOverlay} />}
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
          <Typography gutterBottom variant="h2">
            {event_name}
          </Typography>
          <Typography variant="body1" component="p">
            {truncateText(description, 350)}
          </Typography>
          <Grid item container direction="row" alignItems="center">
            <ScheduleIcon className={classes.icon} />
            <Typography className={classes.subtitle} variant="subtitle1">
              {eventTime}
            </Typography>
          </Grid>
          {ended_at && (
            <Button
              className={classes.eventOverButton}
              variant="contained"
              color="secondary"
              onClick={handleEventOverButtonClick}
            >
              View My Connections
            </Button>
          )}
        </Grid>
      </Grid>
    </FloatCardMediumLarge>
  )
}

export default EventCard
