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

const { giveFeedbackTypeform, becomeAHostTypeform, stephenZoomLink } = constants

const useStyles = makeStyles((theme) => ({
  wrapper: {
    marginTop: '200px',
  },
  topDashboard: {
    width: '100%',
    paddingTop: '40px',
    paddingBottom: '40px',
    borderStyle: 'none none solid',
    borderWidth: '1px',
    borderColor: theme.palette.common.greyBorder,
    borderRadius: '4px 4px 0px 0px',
    backgroundColor: theme.palette.common.greyHighlight,
    // backgroundColor: '#3a3b3c',
  },
  categoryHeader: {
    ...theme.typography.h1,
    color: theme.palette.common.ghostWhite,
    textAlign: 'center',
  },
  sectionHeader: {
    ...theme.typography.h3,
    color: theme.palette.common.ghostWhite,
  },
  cardBodyContainer: {
    padding: '50px',
  },
  cardBodySection: {
    marginBottom: '25px',
  },
  zoomLink: {
    ...theme.typography.h3,
    color: theme.palette.common.ghostWhite,
    width: '60%',
    textAlign: 'center',
    margin: '0 auto',
    marginBottom: '25',
    '&:hover': {
      color: theme.palette.common.orchid,
    },
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

  return (
    <div className={classes.wrapper}>
      <FloatCardMedium>
        <Grid item container justify="center" alignItems="center" className={classes.topDashboard}>
          <div style={{ width: '80%' }}>
            <Typography className={classes.categoryHeader}>{cardHeading}</Typography>
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
            <Grid item className={classes.cardBodySection}>
              <Typography className={classes.zoomLink}>
                <a href={stephenZoomLink} target="_blank" className={classes.zoomLink}>
                  Click to join everyone from the event on a Zoom call!
                </a>
              </Typography>
            </Grid>
            <Grid item className={classes.cardBodySection}>
              <Grid container item direction="row" justify="space-around" alignItems="center">
                <Button
                  variant="contained"
                  color="primary"
                  href={giveFeedbackTypeform}
                  target="_blank"
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
                >
                  Become a Host
                  <span role="img" aria-label="woman hand out">
                    💁‍♀️
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
