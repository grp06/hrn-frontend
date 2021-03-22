import React from 'react'
import { Grid } from '@material-ui/core'
import { OnlineAttendeesCard, SittingOutCard, UserEventStatusCard, useLobbyStyles } from '.'
import {
  AboutTheHostCard,
  EventPhotoBanner,
  EventTitleAndCTACard,
  HostAndEventDescCard,
  PodcastCard,
  TwoSidedEventDescriptionCard,
  WhatToExpect,
} from '../Event'
import { PreEvent } from '../PreEvent'

const LobbyContent = React.memo(
  ({ event, onlineEventUsers, setUserEventStatus, userEventStatus, user, eventId }) => {
    const classes = useLobbyStyles()
    const {
      banner_photo_url,
      host,
      host_id,
      id: event_id,
      matching_type,
      side_a,
      side_b,
      status: eventStatus,
    } = event
    const { id: user_id } = user
    const userIsHost = parseInt(host_id, 10) === parseInt(user_id, 10)
    const isEventParticipant = event?.event_users?.find((u) => u.user.id === user_id)

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
                className={classes.lobbyContentContainer}
              >
                <EventTitleAndCTACard event={event} user={user} />
                <HostAndEventDescCard
                  event={event}
                  numberOfOnlineEventUsers={onlineEventUsers.length}
                  userIsHost={userIsHost}
                />
                <Grid container direction="row" justify="space-between">
                  <Grid
                    container
                    direction="column"
                    className={classes.wideEventAndLobbyContentGrid}
                  >
                    <WhatToExpect userIsHost={userIsHost} />
                    <AboutTheHostCard host={host} userIsHost={userIsHost} />
                  </Grid>
                  <Grid
                    container
                    direction="column"
                    className={classes.narrowEventAndLobbyContentGrid}
                  >
                    {matching_type === 'two-sided' ? (
                      <TwoSidedEventDescriptionCard
                        event_id={event_id}
                        isEventParticipant={isEventParticipant}
                        side_a={side_a}
                        side_b={side_b}
                        user_id={user_id}
                      />
                    ) : null}
                    <OnlineAttendeesCard
                      event={event}
                      onlineEventUsers={onlineEventUsers}
                      userId={user_id}
                    />
                    <PodcastCard />
                  </Grid>
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
                className={classes.lobbyContentContainer}
              >
                <EventTitleAndCTACard event={event} user={user} />
                <Grid container direction="row" justify="space-between">
                  <Grid
                    container
                    direction="column"
                    className={classes.wideEventAndLobbyContentGrid}
                  >
                    {userEventStatus && userEventStatus === 'sitting out' ? (
                      <SittingOutCard setUserEventStatus={setUserEventStatus} />
                    ) : (
                      <UserEventStatusCard userEventStatus={userEventStatus} />
                    )}
                  </Grid>
                  <Grid
                    container
                    direction="column"
                    className={classes.narrowEventAndLobbyContentGrid}
                  >
                    <OnlineAttendeesCard
                      event={event}
                      onlineEventUsers={onlineEventUsers}
                      userId={user_id}
                    />
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
