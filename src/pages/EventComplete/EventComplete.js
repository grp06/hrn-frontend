import React, { useEffect } from 'react'

import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { useSubscription, useQuery } from '@apollo/react-hooks'
import { makeStyles } from '@material-ui/core/styles'
import { useHistory } from 'react-router-dom'

import { useEventContext, useUserContext } from '../../context'
import { getMyMutualThumbsData, getMyConnectionAfterEvent } from '../../gql/queries'
import { Loading } from '../../common'
import { ConnectionCard } from '../MyConnections'
import { constants } from '../../utils'

const { giveFeedbackTypeform, becomeAHostTypeform, linkedInCommunityLink } = constants

const useStyles = makeStyles((theme) => ({
  wrapper: {
    marginTop: '150px',
  },
  topDashboard: {
    width: '100%',
    padding: theme.spacing(5),
    borderStyle: 'none none solid',
    borderWidth: '1px',
    borderColor: theme.palette.common.greyBorder,
    borderRadius: '4px 4px 0px 0px',
    backgroundColor: theme.palette.common.greyHighlight,
    // backgroundColor: '#3a3b3c',
  },
  categoryHeader: {
    margin: theme.spacing(0, 'auto'),
    textAlign: 'center',
  },
  cardBodySection: {
    marginBottom: theme.spacing(3),
  },
  zoomLink: {
    color: theme.palette.common.sunray,
    margin: theme.spacing(0, 'auto', 3, 'auto'),
    '&:hover': {
      color: '#fcd08c',
    },
  },
  button: {
    margin: theme.spacing(1, 1),
  },
  buttonContainer: {
    margin: theme.spacing(3, 'auto', 9, 'auto'),
  },
  upcomingEventsButton: {
    margin: theme.spacing(1, 0),
    backgroundColor: theme.palette.common.ghostWhiteBody,
    color: theme.palette.common.blackBody,
    '&:hover': {
      backgroundColor: theme.palette.common.ghostWhite,
    },
  },
  zoomContainer: {
    width: '75%',
    margin: theme.spacing(4, 'auto', -3, 'auto'),
    textAlign: 'center',
  },
}))

const EventComplete = ({ match }) => {
  const { id: eventId } = match.params
  const classes = useStyles()
  const { event, resetEvent } = useEventContext()
  const { user } = useUserContext()
  const { id: userId } = user

  const localStorageEventId = localStorage.getItem('eventId')
  const history = useHistory()
  const eventSet = Object.keys(event).length > 1

  const { data: myConnectionAfterEventData, loading: myConnectionAfterEventLoading } = useQuery(
    getMyConnectionAfterEvent,
    {
      variables: {
        user_id: userId,
        event_id: eventId,
      },
      skip: !userId || !eventId,
    }
  )

  // const { data: mutualThumbsData, loading: mutualThumbsLoading } = useSubscription(
  //   getMyMutualThumbsData,
  //   {
  //     variables: {
  //       event_id: eventId || localStorageEventId,
  //       user_id: userId,
  //     },
  //   }
  // )

  useEffect(() => {
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
    } else {
      return 'Thanks for joining the event! 🎊'
    }
  }

  const renderPostEventZoomLink = () =>
    event.post_event_link && (
      <Grid>
        <div className={classes.zoomContainer}>
          <Typography variant="h5">
            <a
              href={event.post_event_link}
              target="_blank"
              rel="noopener noreferrer"
              className={classes.zoomLink}
            >
              Click here to join everyone from the event on a video call!
            </a>
          </Typography>
        </div>
      </Grid>
    )

  // const arrayOfMyAllMyUniqueConnections = mutualThumbsData.rounds.map((round) => {
  //   return Object.values(round).filter((person) => person.id !== userId)
  // })

  console.log(myConnectionAfterEventData)

  const renderAllMyEventConnection = () => {
    if (myConnectionAfterEventData && myConnectionAfterEventData.partners.length > 0) {
      return myConnectionAfterEventData.partners.map((partner) => (
        <ConnectionCard
          key={partner.id}
          connection={partner.userByPartnerId}
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
      <Typography variant="h4" className={classes.categoryHeader}>
        {cardHeading()}
      </Typography>
      <Grid container item direction="column" justify="space-around">
        <Grid container direction="column">
          {renderPostEventZoomLink()}
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
              <Grid>
                <Button
                  variant="contained"
                  href={linkedInCommunityLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={classes.button}
                >
                  Join our LinkedIn community
                  <span role="img" aria-label="brief case">
                    💼
                  </span>
                </Button>
              </Grid>
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
          <Grid item className={classes.cardBodySection}>
            {renderAllMyEventConnection()}
          </Grid>
        </Grid>
      </Grid>
    </div>
  )
}
export default EventComplete
