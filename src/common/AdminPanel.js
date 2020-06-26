import React from 'react'

import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
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
  eventPromptModal: {},
}))

const AdminPanel = ({ eventData, timeState }) => {
  const classes = useStyles()

  const {
    event_users,
    id: eventId,
    start_at: eventStartTime,
    description: eventDescription,
    status,
  } = eventData

  const editFormModal = TransitionModal({
    modalBody: <EventForm eventData={eventData} />,
    button: {
      buttonSize: 'large',
      buttonText: '✏️ Edit Event',
    },
  })

  const copyEventPromptModal = TransitionModal({
    modalBody: (
      <Grid container direction="column" justify="center" alignItems="center">
        <div className={classes.eventPromptModal} id="eventPrompt">
          <Typography>Hi 👋, </Typography>
          <Typography>
            I'm hosting a speed-networking event with Hi Right Now at {eventStartTime}. The event
            will have a structure as follows:
          </Typography>
          <List dense>
            <ListItem key={1}>
              <Typography>
                1. You will get paired with one other event participant randomly.
              </Typography>
            </ListItem>
            <ListItem key={2}>
              <Typography>2. You two will video-chat for 5 minutes.</Typography>
            </ListItem>
            <ListItem key={3}>
              <Typography>
                3. Decide if you want to exchange contact details with your partner.
              </Typography>
            </ListItem>
            <ListItem key={4}>
              <Typography>4. Rinse and repeat for an hour!</Typography>
            </ListItem>
          </List>
          <Typography>
            You can sign-up for the event **for free** here (link to event)! Just make sure to come
            back to that page 5 minutes before the event so you can get settled in before the event.
            Can't wait to see your smiling face soon 😁
          </Typography>
        </div>
      </Grid>
    ),
    button: {
      buttonText: '✏️ Share Event',
      buttonColor: 'secondary',
      buttonSize: 'medium',
    },
    onAcceptFunction: () => {
      const copyPrompt = document.getElementById('eventPrompt').innerText
      console.log(copyPrompt)
      // copyPrompt.current.select()
      document.execCommand('copy')
    },
    onAcceptButtonText: 'Copy this prompt!',
  })

  const renderButton = () => {
    let element
    console.log('timeState = ', timeState)

    switch (timeState) {
      case 'within 30 mins':
        element = <StartEventButton within30Mins eventStartTime={eventStartTime} />
        break
      case 'go time':
        element = <StartEventButton eventId={eventId} status={status} />
        break
      default:
        element = (
          <div>
            <div>{editFormModal}</div>
            <div>{copyEventPromptModal}</div>
          </div>
        )
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
