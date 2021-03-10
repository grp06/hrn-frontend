import React from 'react'

import { Grid } from '@material-ui/core'
import {
  AboutTheHostCard,
  EventPhotoBanner,
  EventRSVPsCard,
  EventStatusRedirect,
  EventTitleAndCTACard,
  HostAndEventDescCard,
  JoinEventBanner,
  PodcastCard,
  TwoSidedEventDescriptionCard,
  WhatToExpect,
  useEventStyles,
} from '.'
import { Loading } from '../../common'
import { useEventContext, useUserContext } from '../../context'
import { UserObjectInterface } from '../../utils'

const Event: React.FC<{}> = () => {
  const classes = useEventStyles()
  const { user, userContextLoading } = useUserContext()
  const { event, eventContextLoading } = useEventContext()
  const { id: user_id } = user
  const {
    banner_photo_url,
    event_users,
    host,
    host_id,
    id: event_id,
    matching_type,
    side_a,
    side_b,
    status: event_status,
  } = event

  if (userContextLoading || eventContextLoading) {
    return <Loading />
  }

  localStorage.setItem('eventId', event_id.toString())
  localStorage.setItem('event', JSON.stringify(event))
  const userIsHost = Math.floor(host_id) === Math.floor(user_id)
  const isEventParticipant = event?.event_users?.find(
    (u: { [user: string]: UserObjectInterface }) => u.user.id === user_id
  )

  return (
    <>
      <EventStatusRedirect isEventParticipant={isEventParticipant} event={event} />
      {!isEventParticipant && event_status !== 'not-started' && event_status !== 'complete' ? (
        <JoinEventBanner />
      ) : null}
      <EventPhotoBanner
        bannerPhotoURL={banner_photo_url}
        eventId={event_id}
        userIsHost={userIsHost}
      />
      <Grid
        container
        direction="column"
        justify="flex-start"
        className={classes.eventContentContainer}
      >
        <EventTitleAndCTACard event={event} user={user} />
        <HostAndEventDescCard event={event} userIsHost={userIsHost} />
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
              <EventRSVPsCard eventUsers={event_users} />
            ) : (
              <TwoSidedEventDescriptionCard
                event_id={event_id}
                isEventParticipant={isEventParticipant}
                side_a={side_a}
                side_b={side_b}
                user_id={user_id}
              />
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
}

export default Event
