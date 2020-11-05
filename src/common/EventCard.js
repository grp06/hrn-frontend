import React from 'react'

import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'

import { useHistory } from 'react-router-dom'
import FeatherIcon from 'feather-icons-react'

import globeMask from '../assets/globeMask.png'
import logo from '../assets/HRNlogoNoFrame.svg'
import { formatDate, truncateText } from '../utils'

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
    height: 'auto',
    borderRadius: '4px 0px 0px 4px',
    backgroundPosition: '50% 50%',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
  },
  eventContentContainer: {
    cursor: 'pointer',
    width: '100%',
    height: 'auto',
    padding: '20px',
    [theme.breakpoints.down('sm')]: {
      height: 'auto',
    },
  },
  icon: {
    color: theme.palette.common.ghostWhiteBody,
    margin: theme.spacing(0.5, 0),
  },
  hostNameAndTitleContainer: {
    width: 'auto',
    height: '100%',
    marginLeft: theme.spacing(2),
    padding: theme.spacing(0.5, 0),
  },
  hostName: {
    margin: '0',
  },
  subtitle: {
    margin: theme.spacing(1),
    marginBottom: '10px',
    width: '75%',
    [theme.breakpoints.down('sm')]: {
      width: '90%',
    },
  },
  eventOverButton: {
    position: 'relative',
    zIndex: 10,
  },
}))

const EventCard = ({ event }) => {
  const classes = useStyles()
  const history = useHistory()
  const { banner_photo_url, description, event_name, host, id, start_at, ended_at } = event
  const { name: hostName, profile_pic_url } = host
  const startTime = new Date(start_at).getTime()

  const handleEventOverButtonClick = () => {
    history.push(`/events/${id}/event-complete`)
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
        <Grid
          item
          lg={4}
          md={12}
          className={classes.eventImage}
          style={{
            backgroundImage: banner_photo_url
              ? `url("${banner_photo_url}")`
              : `url("${globeMask}")`,
          }}
        >
          <div />
        </Grid>
        <Grid
          container
          item
          lg={8}
          md={12}
          direction="column"
          justify="flex-start"
          alignItems="flex-start"
          className={classes.eventContentContainer}
        >
          <Typography gutterBottom variant="h2">
            {event_name}
          </Typography>
          <Grid item container direction="row" alignItems="center">
            <FeatherIcon icon="calendar" stroke="#FF99AD" size="24" />
            <Typography variant="body1" className={classes.subtitle}>
              {formatDate(startTime)}
            </Typography>
          </Grid>
          <Grid
            container
            item
            direction="column"
            xs={12}
            md={6}
            style={{ marginTop: '8px', marginBottom: '8px' }}
          >
            <Typography variant="subtitle1">Hosted By /</Typography>
            <Grid container direction="row" alignItems="center" justify="flex-start">
              <Avatar className={classes.avatarContainer}>
                <img alt="company-logo" className={classes.avatar} src={profile_pic_url || logo} />
              </Avatar>
              <Grid
                container
                direction="column"
                justify="center"
                wrap="nowrap"
                className={classes.hostNameAndTitleContainer}
              >
                <Typography variant="h3" className={classes.hostName}>
                  {hostName}
                </Typography>
                {/* <Typography variant="subtitle1">European Gigaloo</Typography> */}
              </Grid>
            </Grid>
          </Grid>
          <Typography variant="subtitle1">Description /</Typography>
          <Typography variant="body1" component="p">
            {truncateText(description, 350)}
          </Typography>

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
