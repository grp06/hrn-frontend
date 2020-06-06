import React from 'react'

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
import { useGameContext } from '../context/useGameContext'
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

const GameOver = () => {
  const classes = useStyles()
  const { eventId, userId } = useGameContext()
  const localStorageEventId = localStorage.getItem('eventId')

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

  // returns [ { id: ___, email: ___ }, {....} ]
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
        </FloatCardMedium>
      ) : (
        <div className={classes.textContainer}>
          <Typography className={classes.categoryHeader}>Thanks for joining the event!</Typography>
        </div>
      )}
    </div>
  )
}
export default GameOver
