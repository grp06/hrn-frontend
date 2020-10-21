import React from 'react'

import Grid from '@material-ui/core/Grid'
import bannerBackground from '../../assets/eventBannerMountain.png'
import { makeStyles } from '@material-ui/styles'

import { OnlineAttendeesCard } from '.'
import { EventTitleAndCTACard, HostAndEventDescCard, PodcastCard, WhatToExpect } from '../Event'
import { PreEvent } from '../PreEvent'
import { getUserEventStatusMessage } from '../../utils'

const useStyles = makeStyles((theme) => ({
  bannerGradient: {
    background:
      'linear-gradient(0deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 58%, rgba(0,212,255,0) 100%)',
    height: 'auto',
    minHeight: '55vh',
    width: '100%',
    position: 'absolute',
    top: '0%',
    bottom: 'auto',
  },
  eventBanner: {
    width: '100%',
    height: 'auto',
    minHeight: '55vh',
    backgroundImage: `url(${bannerBackground})`,
    backgroundPosition: '50% 50%',
    backgroundSize: 'cover',
    zIndex: '-3',
  },
  eventContentContainer: {
    position: 'relative',
    zIndex: '99',
    width: '85%',
    maxWidth: '1560px',
    margin: theme.spacing(-20, 'auto', 12, 'auto'),
  },
  pageContainer: {
    overflowX: 'hidden',
    overflowY: 'hidden',
    paddingBottom: '100px',
  },
  podcastContainer: {
    width: '44%',
    marginBottom: theme.spacing(3),
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
  subtitle: {
    margin: theme.spacing(1),
    marginBottom: '10px',
    width: '75%',
    [theme.breakpoints.down('sm')]: {
      width: '90%',
    },
  },
  whatToExpectContainer: {
    width: '54%',
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
    marginBottom: theme.spacing(3),
  },
}))

const LobbyContent = React.memo(
  ({ event, onlineEventUsers, setUserEventStatus, userEventStatus, user }) => {
    const classes = useStyles()
    const { host_id, status: eventStatus } = event
    const { id: user_id } = user
    const userIsHost = parseInt(host_id, 10) === parseInt(user_id, 10)

    const renderLobbyContent = () => {
      switch (eventStatus) {
        case 'not-started':
          return (
            <>
              <Grid container>
                <div className={classes.eventBanner} />
                <div className={classes.bannerGradient} />
              </Grid>
              <Grid
                container
                direction="column"
                justify="flex-start"
                className={classes.eventContentContainer}
              >
                <EventTitleAndCTACard event={event} user={user} />
                <HostAndEventDescCard event={event} showOnlineAttendees={onlineEventUsers.length} />
                <Grid
                  container
                  direction="row"
                  justify="space-between"
                  className={classes.whatToExpectAndPodcastContainer}
                >
                  <Grid className={classes.whatToExpectContainer}>
                    <WhatToExpect userIsHost={userIsHost} />
                  </Grid>
                  <Grid className={classes.podcastContainer}>
                    {userIsHost ? (
                      <OnlineAttendeesCard onlineEventUsers={onlineEventUsers} />
                    ) : (
                      <PodcastCard />
                    )}
                  </Grid>
                </Grid>
                {userIsHost ? (
                  <Grid container direction="row" justify="flex-end">
                    <div className={classes.podcastContainer}>
                      <PodcastCard />
                    </div>
                  </Grid>
                ) : null}
              </Grid>
            </>
          )
        case 'pre-event':
          return <PreEvent onlineEventUsers={onlineEventUsers} />
        case 'room-in-progress':
        case 'in-between-rounds':
          return (
            <>
              <Grid container>
                <div className={classes.eventBanner} />
                <div className={classes.bannerGradient} />
              </Grid>
              <Grid
                container
                direction="column"
                justify="flex-start"
                className={classes.eventContentContainer}
              >
                <EventTitleAndCTACard event={event} user={user} />
                {getUserEventStatusMessage(setUserEventStatus, userEventStatus)}
              </Grid>
            </>
          )
        default:
          return null
      }
    }

    return <div>{renderLobbyContent()}</div>
  }
)

export default LobbyContent
