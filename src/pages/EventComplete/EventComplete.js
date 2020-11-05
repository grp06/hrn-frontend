import React, { useEffect } from 'react'

import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { useSubscription } from '@apollo/react-hooks'
import { makeStyles } from '@material-ui/core/styles'
import { useHistory } from 'react-router-dom'

import {
  useAppContext,
  useEventContext,
  useUserContext,
  useUserEventStatusContext,
} from '../../context'
import { Loading } from '../../common'
import { listenToMyConnectionsAfterEvent } from '../../gql/subscriptions'
import { ConnectionCard } from '../MyConnections'
import { constants } from '../../utils'
import { EventPhotoBanner, EventTitleAndCTACard } from '../Event'

const { giveFeedbackTypeform, becomeAHostTypeform } = constants

const useStyles = makeStyles((theme) => ({
  buttonCard: {
    backgroundColor: theme.palette.common.greyCard,
    padding: theme.spacing(3, 5),
    borderRadius: '4px',
    marginBottom: theme.spacing(3),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2),
    },
  },
  buttonContainer: {
    width: '44%',
    marginBottom: theme.spacing(3),
    [theme.breakpoints.down('md')]: {
      width: '34%',
    },
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  cardTitle: {
    marginBottom: theme.spacing(3),
  },
  connectionsContainer: {
    padding: theme.spacing(3, 5),
    backgroundColor: theme.palette.common.greyCard,
    borderRadius: '4px',
    width: '54%',
    [theme.breakpoints.down('md')]: {
      width: '64%',
    },
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      padding: theme.spacing(2),
    },
    marginBottom: theme.spacing(3),
  },
  contentContainer: {
    position: 'relative',
    zIndex: '99',
    width: '75vw',
    maxWidth: '1560px',
    margin: theme.spacing(-20, 'auto', 0, 'auto'),
    paddingBottom: '40px',
    [theme.breakpoints.down('xs')]: {
      width: '85vw',
    },
  },
  sideButton: {
    width: '100%',
  },
}))

const EventComplete = ({ match }) => {
  const { id: eventId } = match.params
  const classes = useStyles()
  const { appLoading } = useAppContext()
  const { event, resetEvent } = useEventContext()
  const { user, setUserInEvent } = useUserContext()
  const { setUserHasEnabledCameraAndMic } = useUserEventStatusContext()
  const { id: userId } = user
  const { banner_photo_url, id: event_id } = event

  const history = useHistory()
  const eventSet = Object.keys(event).length > 1

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
    setUserInEvent(false)
    setUserHasEnabledCameraAndMic(false)
    localStorage.setItem('preferredVideoId', '')
    localStorage.setItem('preferredAudioId', '')
    return () => {
      resetEvent()
    }
  }, [])

  useEffect(() => {
    if (eventSet && event.status === 'not-started') {
      history.push(`/events/${eventId}`)
    }
  }, [event])

  if (appLoading || Object.keys(event).length < 2 || myConnectionAfterEventLoading) {
    return <Loading />
  }

  const renderAllMyEventConnection = () => {
    if (myConnectionAfterEventData && myConnectionAfterEventData.partners.length > 0) {
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
      <EventPhotoBanner bannerPhotoURL={banner_photo_url} event_id={event_id} />
      <Grid container direction="column" justify="flex-start" className={classes.contentContainer}>
        <EventTitleAndCTACard event={event} user={user} />
        <Grid container direction="row" justify="space-between">
          <Grid item direction="column" className={classes.connectionsContainer}>
            <Typography variant="h3" className={classes.cardTitle}>
              Connections
            </Typography>
            {renderAllMyEventConnection()}
          </Grid>
          <Grid item direction="column" className={classes.buttonContainer}>
            <Grid
              container
              direction="column"
              justify="flex-start"
              alignItems="flex-start"
              className={classes.buttonCard}
            >
              <Typography variant="h3" className={classes.cardTitle}>
                Want to Host An Event?
              </Typography>
              <Button
                variant="contained"
                color="primary"
                size="large"
                href={becomeAHostTypeform}
                target="_blank"
                rel="noopener noreferrer"
                className={classes.sideButton}
              >
                Become a Host
              </Button>
            </Grid>
            <Grid
              container
              direction="column"
              justify="flex-start"
              alignItems="flex-start"
              className={classes.buttonCard}
            >
              <Typography variant="h3" className={classes.cardTitle}>
                Leave Us a Tip!
              </Typography>
              <Button
                variant="contained"
                color="default"
                size="large"
                href={giveFeedbackTypeform}
                target="_blank"
                rel="noopener noreferrer"
                className={classes.sideButton}
              >
                Give Feedback
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  )
}
export default EventComplete
