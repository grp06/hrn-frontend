import React from 'react'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/styles'

import { AttendeesList, EventCountdown, ListOfRSVPs, ShareEventPromptModal } from '.'
import { EventForm, FloatCardLarge, TransitionModal } from '../../common'

const useStyles = makeStyles((theme) => ({
  topDashboard: {
    width: '100%',
    padding: theme.spacing(5, 0),
    borderStyle: 'none none solid',
    borderWidth: '1px',
    borderColor: theme.palette.common.greyBorder,
    borderRadius: '4px 4px 0px 0px',
    backgroundColor: theme.palette.common.greyHighlight,
  },
  partyEmoji: {
    marginLeft: theme.spacing(1),
  },
  cardBodyContainer: {
    padding: theme.spacing(6),
  },
  descriptionContainer: {
    marginBottom: theme.spacing(3),
  },
  adminButtons: {
    height: 160,
  },
}))

const AdminPanel = ({ eventData, timeState }) => {
  const classes = useStyles()

  const { event_users, id: eventId, start_at: eventStartTime } = eventData

  const editFormModal = TransitionModal({
    modalBody: <EventForm eventData={eventData} />,
    button: {
      buttonColor: 'secondary',
      buttonVariant: 'outlined',
      buttonSize: 'medium',
      buttonText: 'Edit Event',
    },
  })

  const renderOnlineUsers = () => {
    return timeState === 'within 30 mins' ? (
      <Grid container item md={6} xs={12} direction="column">
        <AttendeesList eventId={eventId} timeState={timeState} />
      </Grid>
    ) : null
  }

  const renderTimeUntilEventOrShareEvent = () => {
    return (
      <Grid
        className={classes.adminButtons}
        container
        direction="column"
        alignItems="center"
        justify="space-around"
      >
        {timeState === 'within 30 mins' ? (
          <EventCountdown adminHeader eventStartTime={eventStartTime} />
        ) : (
          <ShareEventPromptModal event={eventData} renderHostMessage />
        )}
        <div>{editFormModal}</div>
      </Grid>
    )
  }

  return (
    <>
      <FloatCardLarge>
        <Grid container justify="space-around" alignItems="center" className={classes.topDashboard}>
          <Grid
            container
            item
            md={6}
            xs={12}
            direction="column"
            justify="center"
            alignItems="center"
          >
            <Typography variant="h5">Participants Signed Up</Typography>
            <Typography variant="h2">{event_users.length}</Typography>
          </Grid>
          <Grid
            container
            item
            md={6}
            xs={12}
            direction="column"
            justify="center"
            alignItems="center"
          >
            {renderTimeUntilEventOrShareEvent()}
          </Grid>
        </Grid>
        <Grid
          container
          direction="row"
          justify="space-around"
          alignItems="flex-start"
          className={classes.cardBodyContainer}
        >
          <Grid
            container
            item
            md={6}
            xs={12}
            direction="column"
            className={classes.descriptionContainer}
          >
            <ListOfRSVPs />
          </Grid>
          {renderOnlineUsers()}
        </Grid>
      </FloatCardLarge>
    </>
  )
}

export default AdminPanel
