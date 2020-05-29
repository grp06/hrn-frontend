import React, { useEffect, useContext, useState } from 'react'

import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemText from '@material-ui/core/ListItemText'
import PersonIcon from '@material-ui/icons/Person'
import { makeStyles } from '@material-ui/styles'
import { useQuery } from 'react-apollo'
import moment from 'moment-timezone'
import { getEventUsers } from '../gql/queries'
import { useGameContext } from '../context/useGameContext'
import { useCreatePairings, useModalFab } from '../hooks'
import { EventForm, FloatCardWide, Loading } from '.'

const useStyles = makeStyles((theme) => ({
  topDashboard: {
    width: '100%',
    paddingTop: '40px',
    paddingBottom: '40px',
    borderStyle: 'none none solid',
    borderWidth: '1px',
    borderColor: theme.palette.common.independence,
    borderRadius: '4px 4px 0px 0px',
    backgroundColor: theme.palette.common.ghostWhite,
  },
  categoryHeader: {
    ...theme.typography.h2,
    color: theme.palette.common.independence,
  },
  displayNumber: {
    fontFamily: 'Muli',
    color: theme.palette.common.orchid,
    fontSize: '4.5rem',
  },
  partyEmoji: {
    marginLeft: 10,
  },
}))

const AdminControl = ({ eventData, timeState }) => {
  console.log('AdminControl -> timeState', timeState)
  const classes = useStyles()
  const { currentRound, eventId } = useGameContext()
  const [showEventForm, setShowEventForm] = useState()
  const { createPairings } = useCreatePairings()
  const { data, loading, error, refetch } = useQuery(getEventUsers, {
    variables: {
      eventId: eventData.events[0].id,
    },
  })

  const editFormModal = useModalFab({
    modalBody: <EventForm eventData={eventData} />,
    button: {
      buttonSize: 'large',
      buttonText: '✏️ Edit Event',
    },
  })

  const renderButton = () => {
    let element
    switch (timeState) {
      case 'future':
        element = editFormModal
        break
      case 'go time':
        element = (
          <Button size="large" variant="contained" color="primary" onClick={createPairings}>
            Start Event
            <span className={classes.partyEmoji} role="img" aria-label="party emoji">
              🥳
            </span>
          </Button>
        )
        break
      default:
        element = null
    }
    return element
  }

  if (loading) {
    return <Loading />
  }

  const attendees = data.event_users
  console.log('attendees', attendees)

  const attendeesList = () => {
    return (
      <List dense>
        {attendees.map(({ user }) => {
          const formattedDate = user.last_seen.slice(0, 10)
          const lastSeen = moment(formattedDate, 'YYYY-MM-DD').fromNow()
          return (
            <ListItem key={user.id}>
              <ListItemAvatar>
                <Avatar>
                  <PersonIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={user.name} secondary={`Last seen: ${lastSeen}`} />
            </ListItem>
          )
        })}
      </List>
    )
  }

  return (
    <FloatCardWide>
      <Grid
        item
        container
        justify="space-around"
        alignItems="center"
        // wrap="nowrap"
        className={classes.topDashboard}
      >
        <Grid container item md={6} xs={12} direction="column" justify="center" alignItems="center">
          <Typography className={classes.categoryHeader}>Participants Signed Up</Typography>
          <Typography className={classes.displayNumber}>{attendees.length}</Typography>
        </Grid>
        <Grid container item md={6} xs={12} direction="column" justify="center" alignItems="center">
          {renderButton()}
        </Grid>
      </Grid>
      {attendeesList()}
      <div style={{ display: showEventForm ? 'block' : 'none' }}>
        <EventForm eventData={eventData} />
      </div>
    </FloatCardWide>
  )
}

export default AdminControl
