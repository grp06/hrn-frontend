import React, { useEffect, useState } from 'react'

import { useMutation } from '@apollo/react-hooks'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/styles'
import { useHistory } from 'react-router-dom'

import { FloatCardLarge, AttendeesList, Timer, HiRightNowBreakdown } from '.'
import { useAppContext } from '../context/useAppContext'
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
  const { user } = useAppContext()
  const { userId, role, name, email } = user
  const {
    id: eventId,
    current_round,
    event_users,
    start_at: eventStartTime,
    event_name,
    description,
    host: eventHost,
  } = eventData
  const { name: eventHostName } = eventHost

  const [waitingForAdmin, setWaitingForAdmin] = useState()

  const alreadyAttending = event_users.find((user) => user.user.id === userId)

  const [insertEventUserMutation] = useMutation(insertEventUser, {
    variables: {
      eventId,
      userId,
    },
    skip: !userId || !eventId,
  })
  const [deleteEventUserMutation] = useMutation(deleteEventUser, {
    variables: {
      eventId,
      userId,
    },
  })

  useEffect(() => {
    if (timeState === 'go time' && alreadyAttending) {
      setWaitingForAdmin(true)
    }
  }, [timeState])

  const handleSignUpClick = () => {
    localStorage.setItem('eventId', eventId)
    history.push('/sign-up')
  }

  const renderSignupButton = () => (
    <Button size="large" color="primary" variant="contained" onClick={() => handleSignUpClick()}>
      Sign Up 🚀
    </Button>
  )

  const renderRsvpButton = () => (
    <Button
      variant="contained"
      size="large"
      color="primary"
      onClick={async () => {
        if (alreadyAttending) {
          try {
            await deleteEventUserMutation()
          } catch (error) {
            console.log('error = ', error)
          }
        } else {
          let calendarInviteResponse
          try {
            await insertEventUserMutation()
            calendarInviteResponse = await fetch(
              `${process.env.REACT_APP_API_URL}/api/email/send-calendar-invite`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Access-Control-Allow-Origin': '*',
                  'Access-Control-Allow-Credentials': true,
                },
                body: JSON.stringify({
                  name,
                  email,
                  event_name,
                  event_id: eventId,
                  description,
                  event_start_time: eventStartTime,
                  host_name: eventHostName,
                }),
              }
            ).then((response) => response.json())

            if (calendarInviteResponse.error) {
              throw calendarInviteResponse.error
            }
          } catch (error) {
            console.log('error = ', error)
          }
        }
        window.location.reload()
      }}
    >
      {alreadyAttending ? 'Cancel RSVP 😔' : 'RSVP for Event 🎊'}
    </Button>
  )

  const renderCTAButton = () => {
    let element
    switch (timeState) {
      case 'future':
        element = !userId ? renderSignupButton() : renderRsvpButton()
        break
      case 'go time':
        element = !userId ? renderSignupButton() : renderRsvpButton()
        break
      default:
        element = !userId ? (
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
      <FloatCardLarge>
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
      </FloatCardLarge>
    )

  return (
    <>
      {renderWaitingForAdmin()}
      <FloatCardLarge>
        <Grid
          item
          container
          justify="space-around"
          alignItems="center"
          // wrap="nowrap"
          className={classes.topDashboard}
        >
          {event_users.length > 10 && (
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
          )}
          <Grid
            container
            item
            md={6}
            xs={12}
            direction="column"
            justify="center"
            alignItems="center"
          >
            {renderCTAButton()}
          </Grid>
        </Grid>
        <HiRightNowBreakdown />
      </FloatCardLarge>
    </>
  )
}
export default UserPanel
