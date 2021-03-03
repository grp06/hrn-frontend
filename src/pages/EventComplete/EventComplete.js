import React, { useEffect } from 'react'
import { useSubscription } from '@apollo/react-hooks'
import { useHistory } from 'react-router-dom'
import { Button, Grid, Typography } from '@material-ui/core'

import { BecomeAHostCard, useEventCompleteStyles } from '.'
import { useEventContext, useUserContext, useUserEventStatusContext } from '../../context'
import { Loading } from '../../common'
import { EventPhotoBanner, EventTitleAndCTACard } from '../Event'
import { listenToMyConnectionsAfterEvent } from '../../gql/subscriptions'
import { ConnectionCard } from '../MyConnections'
import { constants } from '../../utils'

const { giveFeedbackTypeform } = constants

const EventComplete = () => {
  const classes = useEventCompleteStyles()
  const { event, eventContextLoading } = useEventContext()
  const { user, userContextLoading } = useUserContext()
  const { setUserHasEnabledCameraAndMic } = useUserEventStatusContext()
  const { id: userId, role } = user
  const { banner_photo_url, id: eventId } = event

  const history = useHistory()

  const {
    data: myConnectionAfterEventData,
    loading: myConnectionAfterEventLoading,
  } = useSubscription(listenToMyConnectionsAfterEvent, {
    variables: {
      user_id: userId,
      event_id: eventId,
    },
    skip: !userId || !eventId,
  })

  useEffect(() => {
    setUserHasEnabledCameraAndMic(false)
    localStorage.setItem('preferredVideoId', '')
    localStorage.setItem('preferredAudioId', '')
  }, [])

  useEffect(() => {
    // just used for resetting
    if (eventId && event.status === 'not-started') {
      history.push(`/events/${eventId}`)
    }
  }, [event, eventId])

  if (userContextLoading || eventContextLoading || myConnectionAfterEventLoading) {
    return <Loading />
  }

  const renderAllMyEventConnection = () => {
    if (myConnectionAfterEventData?.partners.length > 0) {
      return myConnectionAfterEventData.partners
        .sort((partnerA, partnerB) =>
          partnerA.partner.name.toLowerCase().localeCompare(partnerB.partner.name.toLowerCase())
        )
        .map((partner) => (
          <ConnectionCard
            key={partner.id}
            connection={partner.partner}
            eventId={partner.event_id}
            i_shared_details={partner.i_shared_details}
            partnerId={partner.partner_id}
            smallSize
            userId={partner.user_id}
          />
        ))
    }
  }

  return (
    <div>
      <EventPhotoBanner bannerPhotoURL={banner_photo_url} eventId={eventId} />
      <Grid
        container
        direction="column"
        justify="flex-start"
        className={classes.eventCompleteContentContainer}
      >
        <EventTitleAndCTACard event={event} user={user} />
        <Grid container direction="row" justify="space-between">
          <Grid item direction="column" className={classes.connectionsContainer}>
            <Typography variant="h3" className={classes.eventCompleteCardTitle}>
              Connections
            </Typography>
            {renderAllMyEventConnection()}
          </Grid>
          <Grid item direction="column" className={classes.eventCompleteButtonContainer}>
            <Grid
              container
              direction="column"
              justify="flex-start"
              alignItems="flex-start"
              className={classes.eventCompleteButtonCard}
            >
              <Typography variant="h3" className={classes.eventCompleteCardTitle}>
                Leave Us a Tip!
              </Typography>
              <Button
                variant="contained"
                color="default"
                size="large"
                disableRipple
                href={giveFeedbackTypeform}
                target="_blank"
                rel="noopener noreferrer"
                style={{ width: '100%' }}
              >
                Give Feedback
              </Button>
            </Grid>
            {role && !role.includes('host') ? <BecomeAHostCard /> : null}
          </Grid>
        </Grid>
      </Grid>
    </div>
  )
}
export default EventComplete
