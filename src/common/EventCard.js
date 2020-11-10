import React from 'react'

import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'

import FeatherIcon from 'feather-icons-react'
import { motion } from 'framer-motion'
import { useHistory } from 'react-router-dom'

import globeMask from '../assets/globeMask.png'
import logo from '../assets/HRNlogoNoFrame.svg'
import { formatDate, truncateText } from '../utils'

import { FloatCardMediumLarge } from '.'

const useStyles = makeStyles((theme) => ({
  avatar: {
    width: '100%',
    height: '100%',
  },
  avatarContainer: {
    width: '55px',
    height: '55px',
  },
  eventContainer: {
    width: '100%',
    position: 'relative',
    borderRadius: '4px',
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
    [theme.breakpoints.down('md')]: {
      height: '200px',
    },
  },
  eventContentContainer: {
    cursor: 'pointer',
    width: '100%',
    height: 'auto',
    padding: '20px',
    [theme.breakpoints.down('sm')]: {
      height: 'auto',
    },
    borderRadius: '4px',
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
  liveGlowContaner: {
    borderRadius: '4px',
  },
  liveLogo: {
    position: 'absolute',
    top: '3%',
    right: '2%',
    bottom: 'auto',
    left: 'auto',
    width: '60px',
    height: 'auto',
    color: theme.palette.common.ghostWhite,
    fontWeight: 'bold',
    backgroundColor: theme.palette.common.basePurple,
    borderRadius: '4px',
    textAlign: 'center',
  },
  subtitle: {
    margin: theme.spacing(1),
    marginBottom: '10px',
    width: '75%',
    [theme.breakpoints.down('sm')]: {
      width: '80%',
    },
  },
  eventOverButton: {
    marginTop: theme.spacing(2),
    position: 'relative',
    zIndex: 10,
  },
}))

const liveEventVariants = {
  glow: {
    scale: 1.02,
    boxShadow: '0px 0px 7px 7px #8C57DB',
    transition: {
      duration: 2.0,
      yoyo: Infinity,
    },
  },
}

const EventCard = ({ event }) => {
  const classes = useStyles()
  const history = useHistory()
  const {
    banner_photo_url,
    description,
    event_name,
    host,
    id,
    start_at,
    ended_at,
    status: event_status,
  } = event
  const { name: hostName, profile_pic_url } = host
  const startTime = new Date(start_at).getTime()
  const eventIsLive = event_status !== 'not-started' && event_status !== 'complete'

  const handleEventOverButtonClick = () => {
    history.push(`/events/${id}`)
  }

  const EventCardContent = (
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
          <Grid container item direction="column" style={{ marginTop: '8px', marginBottom: '8px' }}>
            <Typography gutterBottom variant="h2" style={{ marginBottom: 0 }}>
              {event_name}
            </Typography>
            <Grid container direction="row" alignItems="center">
              <FeatherIcon icon="calendar" stroke="#FF99AD" size="24" />
              <Typography variant="body1" className={classes.subtitle}>
                {formatDate(startTime)}
              </Typography>
            </Grid>
            <Grid item direction="column" style={{ marginTop: '8px', marginBottom: '8px' }}>
              <Typography variant="subtitle1">Hosted By /</Typography>
              <Grid container direction="row" alignItems="center" justify="flex-start">
                <Avatar className={classes.avatarContainer}>
                  <img
                    alt="company-logo"
                    className={classes.avatar}
                    src={profile_pic_url || logo}
                  />
                </Avatar>
                <Grid
                  container
                  direction="column"
                  justify="center"
                  wrap="nowrap"
                  className={classes.hostNameAndTitleContainer}
                >
                  <Typography variant="h4" className={classes.hostName}>
                    {hostName}
                  </Typography>
                  {/* <Typography variant="subtitle1">European Gigaloo</Typography> */}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid>
            {ended_at ? (
              <Button
                className={classes.eventOverButton}
                variant="contained"
                color="secondary"
                onClick={handleEventOverButtonClick}
              >
                View My Connections
              </Button>
            ) : (
              <Grid>
                <Typography variant="subtitle1">Description /</Typography>
                <Typography variant="body1" component="p">
                  {truncateText(description, 350)}
                </Typography>
              </Grid>
            )}
          </Grid>
        </Grid>
        {eventIsLive ? (
          <Typography className={classes.liveLogo} variant="subtitle1">
            LIVE
          </Typography>
        ) : null}
      </Grid>
    </FloatCardMediumLarge>
  )

  return eventIsLive ? (
    <motion.div variants={liveEventVariants} animate="glow">
      {EventCardContent}
    </motion.div>
  ) : (
    <motion.div whileHover={{ scale: 1.02 }}>{EventCardContent}</motion.div>
  )
  // return (
  //   <motion.div variants={liveEventVariants} animate="glow" className={classes.liveGlowContainer}>
  //     {EventCardContent}
  //   </motion.div>
  // )
}

export default EventCard
