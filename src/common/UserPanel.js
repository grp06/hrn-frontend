import React, { useEffect, useState } from 'react'
import { useMutation } from '@apollo/react-hooks'

import { makeStyles } from '@material-ui/styles'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import { useHistory } from 'react-router-dom'
import { useGameContext } from '../context/useGameContext'
import { FloatCardWide, AttendeesList, Timer } from '.'
import { insertEventUser, deleteEventUser } from '../gql/mutations'

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

const UserPanel = ({ timeState, eventData, refetch }) => {
  const classes = useStyles()
  const { userId, role, currentRound } = useGameContext()
  const [waitingForAdmin, setWaitingForAdmin] = useState()

  const [insertEventUserMutation] = useMutation(insertEventUser, {
    variables: {
      eventId: eventData.events[0].id,
      userId,
    },
    skip: role === 'host',
  })
  const [deleteEventUserMutation] = useMutation(deleteEventUser, {
    variables: {
      eventId: eventData.events[0].id,
      userId,
    },
    skip: role === 'host',
  })

  useEffect(() => {
    if (timeState === 'go time' && role === 'user') {
      setWaitingForAdmin(true)
    }
  }, [currentRound])
  const { event_users: attendees, start_at: eventStartTime } = eventData.events[0]

  const alreadyAttending = attendees.find((attendee) => attendee.user.id === userId)

  const renderButton = () => {
    let element
    switch (timeState) {
      case 'future':
        element = (
          <Button
            variant="contained"
            size="large"
            onClick={async () => {
              if (alreadyAttending) {
                await deleteEventUserMutation()
                refetch()
              } else {
                await insertEventUserMutation()
                refetch()
              }
            }}
          >
            {alreadyAttending ? 'Cancel RSVP' : 'Join Event'}
          </Button>
        )
        break
      case 'go time':
        element = null
        break
      default:
        element = (
          <>
            <Button
              variant="contained"
              size="large"
              onClick={async () => {
                if (alreadyAttending) {
                  await deleteEventUserMutation()
                  refetch()
                } else {
                  await insertEventUserMutation()
                  refetch()
                }
              }}
            >
              {alreadyAttending ? 'Cancel RSVP' : 'Join Event'}
            </Button>
            <Timer eventStartTime={eventStartTime} subtitle="Event Starts In:" />
          </>
        )
    }
    return element
  }

  if (waitingForAdmin) {
    return (
      <FloatCardWide>
        <Grid
          item
          container
          justify="space-around"
          alignItems="center"
          className={classes.topDashboard}
        >
          <Grid
            container
            item
            md={6}
            xs={12}
            direction="column"
            justify="center"
            alignItems="center"
          >
            <Typography className={classes.categoryHeader}>
              Waiting for host to start event
            </Typography>
          </Grid>
        </Grid>
      </FloatCardWide>
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
      <AttendeesList attendees={attendees} />
    </FloatCardWide>
  )
}
export default UserPanel
