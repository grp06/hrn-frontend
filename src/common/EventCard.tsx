import React from 'react'
// @ts-ignore
import FeatherIcon from 'feather-icons-react'
import { motion } from 'framer-motion'
import { useHistory } from 'react-router-dom'
import { Avatar, Button, Grid, Typography } from '@material-ui/core'
import CallSplitIcon from '@material-ui/icons/CallSplit'
import { FloatCardMediumLarge, useCommonComponentStyles } from '.'
import globeMask from '../assets/globeMask.png'
import logo from '../assets/HRNlogoNoFrame.svg'
import { EventObjectInterface, formatDate, truncateText } from '../utils'

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

interface EventCardProps {
  event: EventObjectInterface
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const classes = useCommonComponentStyles()
  const history = useHistory()
  const {
    banner_photo_url,
    description,
    ended_at,
    event_name,
    host,
    id,
    matching_type,
    start_at,
    status: event_status,
  } = event
  const { first_name: hostName, profile_pic_url } = host
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
        className={classes.eventCardContainer}
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
          className={classes.eventCardImage}
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
          className={classes.eventCardContentContainer}
        >
          <Grid container item direction="column" style={{ marginTop: '8px', marginBottom: '8px' }}>
            <Typography gutterBottom variant="h2" style={{ marginBottom: 0 }}>
              {event_name}
            </Typography>
            <Grid container direction="row" alignItems="center">
              <FeatherIcon icon="calendar" stroke="#FF99AD" size="24" />
              <Typography variant="body1" className={classes.eventCardDateTypography}>
                {formatDate(startTime)}
              </Typography>
            </Grid>
            {matching_type === 'two-sided' ? (
              <Grid container alignItems="center" className={classes.twoSidedLogo}>
                <CallSplitIcon />
                <Typography variant="subtitle1" style={{ color: '#000000', fontWeight: 'bold' }}>
                  two-sided event
                </Typography>
              </Grid>
            ) : null}
            <Grid
              container
              item
              direction="column"
              style={{ marginTop: '8px', marginBottom: '8px' }}
            >
              <Typography variant="subtitle1">Hosted By /</Typography>
              <Grid container direction="row" alignItems="center" justify="flex-start">
                <Avatar className={classes.eventCardHostAvatarContainer}>
                  <img
                    alt="company-logo"
                    className={classes.eventCardHostAvatar}
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
