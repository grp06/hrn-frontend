import React from 'react'

import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import { makeStyles } from '@material-ui/styles'

import {
  EventForm,
  FloatCardLarge,
  AttendeesList,
  TransitionModal,
  StartEventButton,
  ListOfRSVPs,
} from '.'

const useStyles = makeStyles((theme) => ({
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
    ...theme.typography.h2,
    color: theme.palette.common.ghostWhite,
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
  partyEmoji: {
    marginLeft: 10,
  },
  cardBodyContainer: {
    padding: '50px',
  },
  descriptionContainer: {
    marginBottom: '25px',
  },
}))

const AdminPanel = ({ eventData, timeState }) => {
  const classes = useStyles()

  const editFormModal = TransitionModal({
    modalBody: <EventForm eventData={eventData} />,
    button: {
      buttonSize: 'large',
      buttonText: '✏️ Edit Event',
    },
  })

  const {
    event_users,
    id: eventId,
    start_at: eventStartTime,
    description: eventDescription,
    status,
  } = eventData

  const renderButton = () => {
    let element

    switch (timeState) {
      case 'within 30 mins':
        element = <StartEventButton within30Mins eventStartTime={eventStartTime} />
        break
      case 'go time':
        element = <StartEventButton eventId={eventId} status={status} />
        break
      default:
        element = editFormModal
        break
    }
    return element
  }

  return (
    <FloatCardLarge>
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
          <Typography className={classes.displayNumber}>{event_users.length}</Typography>
        </Grid>
        <Grid container item md={6} xs={12} direction="column" justify="center" alignItems="center">
          {renderButton()}
        </Grid>
      </Grid>
      <Grid
        container
        item
        direction="column"
        justify="space-around"
        className={classes.cardBodyContainer}
      >
        <Grid container item direction="column" className={classes.descriptionContainer}>
          <Typography className={classes.sectionHeader}>Description</Typography>
          <Typography variant="body1">{eventDescription}</Typography>
        </Grid>
        <Divider light variant="middle" />
        {timeState === 'future' ? (
          <ListOfRSVPs />
        ) : (
          <AttendeesList eventId={eventId} timeState={timeState} />
        )}
      </Grid>
    </FloatCardLarge>
  )
}

export default AdminPanel
