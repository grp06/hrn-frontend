import React, { useEffect } from 'react'
import { useQuery } from '@apollo/react-hooks'
import { useHistory } from 'react-router-dom'
import { Button, Grid, Typography } from '@material-ui/core'

import { useEventCompleteStyles } from '.'
import { useEventContext, useUserContext, useUserEventStatusContext } from '../../context'
import { Loading } from '../../common'
import { EventPhotoBanner, EventTitleAndCTACard } from '../Event'
import { constants } from '../../utils'
import { getAllPartnersFromEvent } from '../../gql/queries'
import { ConnectionCard } from '../MyConnections'

const { giveFeedbackTypeform } = constants

const EventComplete = ({ location }) => {
  const classes = useEventCompleteStyles()
  const { event, eventContextLoading } = useEventContext()
  const { user, userContextLoading } = useUserContext()
  const { setUserHasEnabledCameraAndMic } = useUserEventStatusContext()
  const { id: userId } = user
  const { banner_photo_url, id: eventId } = event
  const locationState = location.state && Object.keys(location.state).length ? location.state : {}

  const history = useHistory()

  const { data: myConnectionAfterEventData } = useQuery(getAllPartnersFromEvent, {
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
  }, []) //eslint-disable-line

  useEffect(() => {
    // just used for resetting
    if (event?.id && event?.status !== 'complete' && !locationState.leftEventEarly) {
      history.push(`/events/${event.id}`)
    }
  }, [event, history, locationState])

  if (userContextLoading || eventContextLoading) {
    return <Loading />
  }

  const renderAllMyEventConnection = () => {
    if (myConnectionAfterEventData?.partners.length > 0) {
      return myConnectionAfterEventData.partners
        .sort((partnerA, partnerB) =>
          partnerA.partner.first_name
            .toLowerCase()
            .localeCompare(partnerB.partner.first_name.toLowerCase())
        )
        .map((partner) => (
          <div key={partner.id}>
            <ConnectionCard
              connection={partner.partner}
              eventId={partner.event_id}
              partnerId={partner.partner_id}
              smallSize
              userId={partner.user_id}
            />
          </div>
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
          <Grid container direction="column" className={classes.connectionsContainer}>
            <Typography variant="h3" className={classes.eventCompleteCardTitle}>
              Connections
            </Typography>
            {renderAllMyEventConnection()}
          </Grid>
          <Grid container direction="column" className={classes.eventCompleteButtonContainer}>
            <Grid
              container
              direction="column"
              justify="flex-start"
              alignItems="flex-start"
              className={classes.eventCompleteButtonCard}
            >
              <Typography variant="h3" className={classes.eventCompleteCardTitle}>
                How Are We Doing?
              </Typography>
              <Button
                variant="contained"
                color="primary"
                size="large"
                disableRipple
                href={giveFeedbackTypeform}
                target="_blank"
                rel="noopener noreferrer"
                style={{ width: '100%' }}
              >
                Give Us Some Feedback
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  )
}
export default EventComplete
