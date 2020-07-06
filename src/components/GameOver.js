import React, { useEffect } from 'react'

import { useSubscription } from '@apollo/react-hooks'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { useHistory } from 'react-router-dom'
import { useAppContext } from '../context/useAppContext'
import { getMyMutualThumbsData } from '../gql/queries'
import { FloatCardMedium, Loading, MutualThumbsList } from '../common'

const useStyles = makeStyles((theme) => ({
  wrapper: {
    marginTop: '100px',
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
  displayNumber: {
    fontFamily: 'Muli',
    color: theme.palette.common.orchid,
    fontSize: '4.5rem',
  },
  cardBodyContainer: {
    padding: '50px',
  },
  descriptionContainer: {
    marginBottom: '25px',
  },
  textContainer: {
    marginTop: '-100px',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    height: '100vh',
    alignItems: 'center',
    flexDirection: 'column',
  },
  zoomLink: {
    ...theme.typography.h3,
    color: theme.palette.common.sunray,
    width: '60%',
    textAlign: 'center',
    margin: '0 auto',
    textDecoration: 'underline',
    marginBottom: '25',
  },
}))

const GameOver = ({ match }) => {
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

  return (
    <div className={classes.wrapper}>
      {mutualThumbsData.rounds.length > 0 ? (
        <FloatCardMedium>
          <Grid
            item
            container
            justify="center"
            alignItems="center"
            className={classes.topDashboard}
          >
            <div style={{ width: '80%' }}>
              <Typography className={classes.categoryHeader}>
                Say Hi Right Now to your new friends 👋
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
            <Grid container item direction="column" className={classes.descriptionContainer}>
              <MutualThumbsList mutualThumbsData={mutualThumbsData} userId={userId} />
            </Grid>
          </Grid>
          <Grid container item direction="column" className={classes.descriptionContainer}>
            <Typography className={classes.zoomLink}>
              <a
                href="https://us04web.zoom.us/j/4926017058?pwd=QnVLMHloaGtKWWg2L01EeFZhUFNjQT09"
                target="_blank"
                className={classes.zoomLink}
              >
                Click to join everyone from the event on a Zoom call!
              </a>
            </Typography>
          </Grid>
        </FloatCardMedium>
      ) : (
        <div className={classes.textContainer}>
          <Typography className={classes.categoryHeader}>Thanks for joining the event!</Typography>
          <Grid container item direction="column" className={classes.descriptionContainer}>
            <Typography className={classes.zoomLink}>
              <a
                href="https://us04web.zoom.us/j/4926017058?pwd=QnVLMHloaGtKWWg2L01EeFZhUFNjQT09"
                target="_blank"
                className={classes.zoomLink}
              >
                Click to join everyone from the event on a Zoom call!
              </a>
            </Typography>
          </Grid>
        </div>
      )}
    </div>
  )
}
export default GameOver
