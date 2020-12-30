import React from 'react'

import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/styles'

import { OnlineAttendeesCard } from '.'
import {
  AboutTheHostCard,
  EventPhotoBanner,
  EventTitleAndCTACard,
  HostAndEventDescCard,
  PodcastCard,
  WhatToExpect,
} from '../Event'
import { PreEvent } from '../PreEvent'
import { getUserEventStatusMessage } from '../../utils'

const useStyles = makeStyles((theme) => ({
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
    const { banner_photo_url, host, host_id, id: event_id, status: eventStatus } = event
    const { id: user_id } = user
    const userIsHost = parseInt(host_id, 10) === parseInt(user_id, 10)

    const renderLobbyContent = () => {
      switch (eventStatus) {
        case 'not-started':
          return (
            <>
              <EventPhotoBanner
                bannerPhotoURL={banner_photo_url}
                event_id={event_id}
                userIsHost={userIsHost}
              />
              <Grid
                container
                direction="column"
                justify="flex-start"
                className={classes.eventContentContainer}
              >
                <EventTitleAndCTACard event={event} user={user} />
                <HostAndEventDescCard
                  event={event}
                  showOnlineAttendees={onlineEventUsers.length}
                  userIsHost={userIsHost}
                />
                <Grid container direction="row" justify="space-between">
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
                  <Grid container direction="row" justify="space-between">
                    <div className={classes.whatToExpectContainer}>
                      <AboutTheHostCard host={host} userIsHost={userIsHost} />
                    </div>
                    <div className={classes.podcastContainer}>
                      <PodcastCard />
                    </div>
                  </Grid>
                ) : (
                  <Grid container direction="row" justify="flex-start">
                    <div className={classes.whatToExpectContainer}>
                      <AboutTheHostCard host={host} userIsHost={userIsHost} />
                    </div>
                  </Grid>
                )}
              </Grid>
            </>
          )
        case 'pre-event':
          return <PreEvent onlineEventUsers={onlineEventUsers} />
        case 'room-in-progress':
        case 'in-between-rounds':
          return (
            <>
              <EventPhotoBanner
                bannerPhotoURL={banner_photo_url}
                event_id={event_id}
                userIsHost={userIsHost}
              />
              <Grid
                container
                direction="column"
                justify="flex-start"
                className={classes.eventContentContainer}
              >
                <EventTitleAndCTACard event={event} user={user} />

                <Grid container direction="row" justify="space-between">
                  <Grid className={classes.whatToExpectContainer}>
                    {getUserEventStatusMessage(setUserEventStatus, userEventStatus)}
                  </Grid>
                  <Grid className={classes.podcastContainer}>
                    <PodcastCard />
                  </Grid>
                </Grid>
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
