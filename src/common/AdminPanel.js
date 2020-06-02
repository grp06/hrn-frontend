import React, { useEffect } from 'react'

import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/styles'
import { useHistory } from 'react-router-dom'

import { EventForm, FloatCardWide, AttendeesList, TransitionModal, Timer } from '.'
import { useGameContext } from '../context/useGameContext'
import { startEvent } from '../helpers'

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
  const classes = useStyles()
  const { currentRound, setAttendees, setEventId, userId } = useGameContext()
  const history = useHistory()

  const editFormModal = TransitionModal({
    modalBody: <EventForm eventData={eventData} />,
    button: {
      buttonSize: 'large',
      buttonText: '✏️ Edit Event',
    },
  })
  const { event_users: attendees, id: eventId, start_at: eventStartTime } = eventData.events[0]
  // const attendees = eventData.events[0].event_users
  // const eventId = eventData.events[0].id

  // already doing this on event.js
  // useEffect(() => {
  //   if (currentRound > 0) {
  //     history.push('/video-room')
  //   }
  // }, [currentRound])

  const renderButton = () => {
    let element
    switch (timeState) {
      case 'future':
        element = editFormModal
        break
      case 'go time':
        element = (
          <Button
            size="large"
            variant="contained"
            color="primary"
            onClick={() => startEvent(eventId, userId)}
          >
            Start Event
            <span className={classes.partyEmoji} role="img" aria-label="party emoji">
              🥳
            </span>
          </Button>
        )
        break
      default:
        element = (
          <>
            <Button size="large" variant="contained" disabled color="primary">
              Start Event
              <span className={classes.partyEmoji} role="img" aria-label="party emoji">
                🥳
              </span>
            </Button>
            <Timer eventStartTime={eventStartTime} subtitle="Event Starts In:" />
          </>
        )
    }
    return element
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
      <AttendeesList attendees={attendees} />
    </FloatCardWide>
  )
}

export default AdminControl
