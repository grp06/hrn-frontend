import React from 'react'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'

import FeatherIcon from 'feather-icons-react'
import { motion } from 'framer-motion'
import { useHistory } from 'react-router-dom'

import { formatDate } from '../utils'

import { FloatCardMediumLarge } from '.'

const useStyles = makeStyles((theme) => ({
  chitChatContainer: {
    width: '100%',
    position: 'relative',
    borderRadius: '4px',
  },
  chitChatEndedOverlay: {
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
  chitChatContentContainer: {
    cursor: 'pointer',
    width: '100%',
    height: 'auto',
    padding: '20px',
    [theme.breakpoints.down('sm')]: {
      height: 'auto',
    },
    borderRadius: '4px',
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

const ChitChatCard = ({ chitChat }) => {
  const classes = useStyles()
  const { host, id, start_at, ended_at, status: event_status } = chitChat
  const { name: hostName } = host
  const startTime = new Date(start_at).getTime()
  const eventIsLive = event_status !== 'not-started' && event_status !== 'complete'
  const history = useHistory()

  const ChitChatCardContent = (
    <FloatCardMediumLarge>
      <Grid container direction="column" className={classes.chitChatContainer}>
        <Grid
          container
          item
          lg={8}
          md={12}
          direction="column"
          justify="flex-start"
          alignItems="flex-start"
          className={classes.chitChatContentContainer}
          onClick={() => {
            if (!ended_at) {
              history.push(`/chit-chat/${id}`)
            }
          }}
        >
          <Grid container item direction="column" style={{ marginTop: '8px', marginBottom: '8px' }}>
            <Typography gutterBottom variant="h2" style={{ marginBottom: 0 }}>
              {`Meet ${hostName}`}
            </Typography>
            <Grid container direction="row" alignItems="center">
              <FeatherIcon icon="calendar" stroke="#FF99AD" size="24" />
              <Typography variant="body1" className={classes.subtitle}>
                {formatDate(startTime)}
              </Typography>
            </Grid>
          </Grid>
          <Grid>
            {ended_at ? <Typography variant="subtitle1">Event Complete /</Typography> : <Grid />}
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
      {ChitChatCardContent}
    </motion.div>
  ) : (
    <motion.div whileHover={{ scale: 1.02 }}>{ChitChatCardContent}</motion.div>
  )
}

export default ChitChatCard
