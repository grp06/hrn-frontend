import React, { useEffect, useState } from 'react'

import { useMutation } from '@apollo/react-hooks'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/styles'
import { useHistory } from 'react-router-dom'

import { FloatCardWide, AttendeesList, Timer } from '.'
import { useGameContext } from '../context/useGameContext'
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
  const history = useHistory()
  const { userId, role, currentRound, eventId } = useGameContext()
  const [waitingForAdmin, setWaitingForAdmin] = useState()
  const { event_users, start_at: eventStartTime } = eventData.events[0]

  const alreadyAttending = event_users.find((user) => user.user.id === userId)
  const [insertEventUserMutation] = useMutation(insertEventUser, {
    variables: {
      eventId,
      userId,
    },
    skip: role === 'host',
  })
  const [deleteEventUserMutation] = useMutation(deleteEventUser, {
    variables: {
      eventId,
      userId,
    },
    skip: role === 'host',
  })

  useEffect(() => {
    if (timeState === 'go time' && role === 'user' && alreadyAttending) {
      setWaitingForAdmin(true)
    }
  }, [timeState, role])

  const handleSignUpClick = () => {
    debugger
    localStorage.setItem('eventId', eventId)
    history.push('/sign-up')
  }

  const token = localStorage.getItem('token')

  const renderSignupButton = () => (
    <Button size="large" color="primary" variant="contained" onClick={() => handleSignUpClick()}>
      Sign Up
    </Button>
  )

  const renderRsvpButton = () => (
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

  const renderButton = () => {
    let element
    switch (timeState) {
      case 'future':
        element = !token ? renderSignupButton() : renderRsvpButton()
        break
      case 'go time':
        element = !alreadyAttending ? renderRsvpButton() : null
        break
      default:
        element = !token ? (
          renderSignupButton()
        ) : (
          <>
            {renderRsvpButton()}
            <Timer eventStartTime={eventStartTime} subtitle="Event Starts In:" />
          </>
        )
    }
    return element
  }

  const renderWaitingForAdmin = () =>
    waitingForAdmin && (
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

  return (
    <>
      <FloatCardWide>
        <Grid
          item
          container
          justify="space-around"
          alignItems="center"
          // wrap="nowrap"
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
            <Typography className={classes.categoryHeader}>Participants Signed Up</Typography>
            <Typography className={classes.displayNumber}>{event_users.length}</Typography>
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
            {renderButton()}
          </Grid>
        </Grid>
      </FloatCardWide>
      {renderWaitingForAdmin()}
    </>
  )
}
export default UserPanel
