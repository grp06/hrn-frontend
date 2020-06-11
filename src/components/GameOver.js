import React, { useEffect } from 'react'

import { useQuery } from '@apollo/react-hooks'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Divider from '@material-ui/core/Divider'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import PersonIcon from '@material-ui/icons/Person'
import Avatar from '@material-ui/core/Avatar'
import { useHistory, Redirect } from 'react-router-dom'
import { useAppContext } from '../context/useAppContext'
import { useEventContext } from '../context/useEventContext'
import { getMyMutualThumbsData } from '../gql/queries'
import { FloatCardMedium, Loading } from '../common'

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
  zoomLink: {
    ...theme.typography.h3,
    color: theme.palette.common.ghostWhite,
    textAlign: 'center',
    '& a': {
      color: theme.palette.common.ghostWhite,
    },
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
  inlineEmailText: {
    ...theme.typography.body1,
    display: 'inline',
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
}))

const GameOver = ({ match }) => {
  const { id: eventId } = match.params
  const classes = useStyles()
  const { user } = useAppContext()
  const { userId } = user
  const { event } = useEventContext()
  const { event_id } = event

  const localStorageEventId = localStorage.getItem('eventId')
  const history = useHistory()

  const {
    data: mutualThumbsData,
    loading: mutualThumbsLoading,
    error: mutualThumbsError,
    refetch,
  } = useQuery(getMyMutualThumbsData, {
    variables: {
      event_id: eventId || localStorageEventId,
      user_id: userId,
    },
  })

  if (mutualThumbsLoading) {
    return <Loading />
  }

  // returns [ { id: ___, email: ___ }, {....} ] -- dope typescript bro
  const partnerDetails = mutualThumbsData.rounds.map((round) => {
    const idsAndEmails = Object.values(round)
    return idsAndEmails.filter((person) => person.id !== userId)
  })

  const renderList = () => {
    return partnerDetails.map((partner) => {
      return (
        <>
          <ListItem key={partner[0].id}>
            <ListItemAvatar>
              <Avatar>
                <PersonIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={partner[0].name}
              secondary={
                <Typography component="span" className={classes.inlineEmailText}>
                  {partner[0].email}
                </Typography>
              }
            />
          </ListItem>
          <Divider variant="inset" component="li" />
        </>
      )
    })
  }

  return (
    <div className={classes.wrapper}>
      {partnerDetails.length > 0 ? (
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
              <List>{renderList()}</List>
            </Grid>
          </Grid>
          <Typography className={classes.zoomLink}>
            Join everyone on you've met on Zoom right now! <br />
            <a href="https://us04web.zoom.us/j/4926017058?pwd=QnVLMHloaGtKWWg2L01EeFZhUFNjQT09">
              https://us04web.zoom.us/j/4926017058?pwd=QnVLMHloaGtKWWg2L01EeFZhUFNjQT09
            </a>
          </Typography>
        </FloatCardMedium>
      ) : (
        <div className={classes.textContainer}>
          <Typography className={classes.categoryHeader}>Thanks for joining the event!</Typography>
          <Typography className={classes.zoomLink}>
            Join everyone on Zoom right now! <br />
            <a href="https://us04web.zoom.us/j/4926017058?pwd=QnVLMHloaGtKWWg2L01EeFZhUFNjQT09">
              https://us04web.zoom.us/j/4926017058?pwd=QnVLMHloaGtKWWg2L01EeFZhUFNjQT09
            </a>
          </Typography>
        </div>
      )}
    </div>
  )
}
export default GameOver
