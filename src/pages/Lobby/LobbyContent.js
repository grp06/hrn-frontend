import React from 'react'
import { Grid } from '@material-ui/core'
import { OnlineAttendeesCard, SittingOutCard, UserEventStatusCard, useLobbyStyles } from '.'
import {
  AboutTheHostCard,
  EventPhotoBanner,
  EventTitleAndCTACard,
  HostAndEventDescCard,
  PodcastCard,
  WhatToExpect,
} from '../Event'
import { PreEvent } from '../PreEvent'

const LobbyContent = React.memo(
  ({ event, onlineEventUsers, setUserEventStatus, userEventStatus, user, eventId }) => {
    const classes = useLobbyStyles()
    const { banner_photo_url, host, host_id, status: eventStatus } = event
    const { id: user_id } = user
    const userIsHost = parseInt(host_id, 10) === parseInt(user_id, 10)

    const renderLobbyContent = () => {
      switch (eventStatus) {
        case 'not-started':
          return (
            <>
              <EventPhotoBanner
                bannerPhotoURL={banner_photo_url}
                eventId={eventId}
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
                    <OnlineAttendeesCard onlineEventUsers={onlineEventUsers} />
                  </Grid>
                </Grid>
                <Grid container direction="row" justify="space-between">
                  <div className={classes.whatToExpectContainer}>
                    <AboutTheHostCard host={host} userIsHost={userIsHost} />
                  </div>
                  <div className={classes.podcastContainer}>
                    <PodcastCard />
                  </div>
                </Grid>
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
                eventId={eventId}
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
                    {userEventStatus && userEventStatus === 'sitting out' ? (
                      <SittingOutCard setUserEventStatus={setUserEventStatus} />
                    ) : (
                      <UserEventStatusCard userEventStatus={userEventStatus} />
                    )}
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
