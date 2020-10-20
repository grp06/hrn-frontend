import React, { useEffect } from 'react'

import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { useSubscription } from '@apollo/react-hooks'
import { makeStyles } from '@material-ui/core/styles'
import { useHistory } from 'react-router-dom'

import { useEventContext, useUserContext, useUserEventStatusContext } from '../../context'
import { listenToMyConnectionsAfterEvent } from '../../gql/subscriptions'
import { Loading } from '../../common'
import { ConnectionCard } from '../MyConnections'
import { constants } from '../../utils'

const { giveFeedbackTypeform, becomeAHostTypeform } = constants

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1, 1),
  },
  buttonContainer: {
    margin: theme.spacing(3, 'auto', 9, 'auto'),
  },
  categoryHeader: {
    margin: theme.spacing(0, 'auto'),
    textAlign: 'center',
  },
  connectionGrid: {
    margin: theme.spacing(0, 'auto'),
    [theme.breakpoints.down('xl')]: {
      width: '85%',
    },
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  upcomingEventsButton: {
    margin: theme.spacing(1, 0),
    backgroundColor: theme.palette.common.ghostWhiteBody,
    color: theme.palette.common.blackBody,
    '&:hover': {
      backgroundColor: theme.palette.common.ghostWhite,
    },
  },
  wrapper: {
    marginTop: '100px',
  },
}))

const EventComplete = ({ match }) => {
  const { id: eventId } = match.params
  const classes = useStyles()
  const { event, resetEvent } = useEventContext()
  const { user, setUserInEvent } = useUserContext()
  const { setUserHasEnabledCameraAndMic } = useUserEventStatusContext()
  const { id: userId } = user

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

  if (myConnectionAfterEventLoading) {
    return <Loading />
  }

  const cardHeading = () => {
    if (myConnectionAfterEventData && myConnectionAfterEventData.partners.length > 0) {
      return 'Say Hi Right Now to your new friends 👋'
    }
    return 'Thanks for joining the event! 🎊'
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
            i_shared_details={partner.i_shared_details}
            partnerId={partner.partner_id}
            userId={partner.user_id}
            eventId={partner.event_id}
          />
        ))
    }
  }

  return (
    <div className={classes.wrapper}>
      <Typography variant="h1" className={classes.categoryHeader}>
        {cardHeading()}
      </Typography>
      <Grid container item direction="column" justify="space-around">
        <Grid container direction="column">
          <Grid item className={classes.buttonContainer}>
            <Grid
              container
              item
              direction="column"
              justify="space-around"
              alignItems="center"
              md={12}
              xs={12}
            >
              <Grid container direction="row" justify="space-around" alignItems="center">
                <Button
                  variant="contained"
                  color="primary"
                  href={giveFeedbackTypeform}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={classes.button}
                >
                  Give Feedback{' '}
                  <span role="img" aria-label="woman hand out">
                    💭
                  </span>
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  href={becomeAHostTypeform}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={classes.button}
                >
                  Become a Host
                  <span role="img" aria-label="woman hand out">
                    💁‍♀️
                  </span>
                </Button>
              </Grid>
              {event.post_event_link && (
                <Grid>
                  <Button
                    variant="contained"
                    href={event.post_event_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={classes.button}
                  >
                    Join everyone on Zoom now!
                    <span role="img" aria-label="movie camera">
                      🎥
                    </span>
                  </Button>
                </Grid>
              )}
              <Grid>
                <Button
                  variant="contained"
                  className={classes.upcomingEventsButton}
                  onClick={() => history.push('/events')}
                  target="_blank"
                >
                  Join our Upcoming Events
                  <span role="img" aria-label="red balloon">
                    🎈
                  </span>
                </Button>
              </Grid>
            </Grid>
          </Grid>
          <Grid container justify="center" className={classes.connectionGrid}>
            {renderAllMyEventConnection()}
          </Grid>
        </Grid>
      </Grid>
    </div>
  )
}
export default EventComplete
