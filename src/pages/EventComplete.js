import React, { useEffect } from 'react'

import { useSubscription } from '@apollo/react-hooks'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { useHistory } from 'react-router-dom'
import { useAppContext } from '../context/useAppContext'
import { getMyMutualThumbsData } from '../gql/queries'
import { FloatCardMedium, Loading, MutualThumbsList } from '../common'
import { constants } from '../utils'

const { giveFeedbackTypeform, becomeAHostTypeform, linkedInCommunityLink } = constants

const useStyles = makeStyles((theme) => ({
  wrapper: {
    marginTop: '200px',
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
    textAlign: 'center',
  },
  cardBodyContainer: {
    padding: '50px',
  },
  cardBodySection: {
    marginBottom: theme.spacing(3),
  },
  zoomLink: {
    color: theme.palette.common.ghostWhite,
    width: '60%',
    textAlign: 'center',
    margin: theme.spacing(0, 'auto', 3, 'auto'),
    '&:hover': {
      color: theme.palette.common.orchid,
    },
  },
  button: {
    margin: theme.spacing(1.5, 0),
  },
}))

const EventComplete = ({ match }) => {
  const { id: eventId } = match.params
  const classes = useStyles()
  const { user, event } = useAppContext()
  const { userId } = user

  const localStorageEventId = localStorage.getItem('eventId')
  const history = useHistory()
  const eventSet = Object.keys(event).length > 1

  const { data: mutualThumbsData, loading: mutualThumbsLoading } = useSubscription(
    getMyMutualThumbsData,
    {
      variables: {
        event_id: eventId || localStorageEventId,
        user_id: userId,
      },
    }
  )

  useEffect(() => {
    if (eventSet && event.status === 'not-started') {
      history.push(`/events/${eventId}`)
    }
  }, [event])

  if (mutualThumbsLoading) {
    return <Loading />
  }

  const cardHeading =
    mutualThumbsData.rounds.length > 0
      ? 'Say Hi Right Now to your new friends 👋'
      : 'Thanks for joining the event! 🎊'

  const renderPostEventZoomLink = () =>
    event.post_event_link && (
      <Grid item className={classes.cardBodySection}>
        <Typography variant="h5">
          <a
            href={event.post_event_link}
            target="_blank"
            rel="noopener noreferrer"
            className={classes.zoomLink}
          >
            Click to join everyone from the event on a video call!
          </a>
        </Typography>
      </Grid>
    )

  return (
    <div className={classes.wrapper}>
      <FloatCardMedium>
        <Grid item container justify="center" alignItems="center" className={classes.topDashboard}>
          <div style={{ width: '80%' }}>
            <Typography variant="h4" className={classes.categoryHeader}>
              {cardHeading}
            </Typography>
          </div>
        </Grid>
        <Grid
          container
          item
          direction="column"
          justify="space-around"
          className={classes.cardBodyContainer}
        >
          <Grid container direction="column">
            <Grid item className={classes.cardBodySection}>
              <MutualThumbsList mutualThumbsData={mutualThumbsData} userId={userId} />
            </Grid>
            {renderPostEventZoomLink()}
            <Grid item className={classes.cardBodySection}>
              <Grid container item direction="row" justify="space-around" alignItems="center">
                <Button
                  variant="contained"
                  color="primary"
                  href={giveFeedbackTypeform}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={classes.button}
                >
                  Give Feedback
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
            </Grid>
          </Grid>
        </Grid>
      </FloatCardMedium>
    </div>
  )
}
export default EventComplete
