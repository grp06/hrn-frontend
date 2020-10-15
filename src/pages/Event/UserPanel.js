import React, { useState } from 'react'

import { useMutation } from '@apollo/react-hooks'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { useHistory } from 'react-router-dom'
import { makeStyles } from '@material-ui/styles'

import { EventBreakdownStepper, EventCountdown, ShareEventPromptModal } from '.'
import { FloatCardLarge } from '../../common'
import { useUserContext } from '../../context'
import { insertEventUser, deleteEventUser } from '../../gql/mutations'

const useStyles = makeStyles((theme) => ({
  centerText: {
    textAlign: 'center',
  },
  ctaButtonContainer: {
    minHeight: '125px',
    height: 'auto',
  },
  partyEmoji: {
    marginLeft: theme.spacing(1),
  },
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
    position: 'absolute',
    left: 0,
    bottom: 0,
    right: 0,
    top: 'auto',
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
  },
}))

const UserPanel = ({ timeState, eventData }) => {
  const classes = useStyles()
  const history = useHistory()
  const [rsvpInFlight, setRSVPInFlight] = useState(false)
  const { user } = useUserContext()
  const { id: userId, name, email } = user
  const {
    id: eventId,
    event_users,
    start_at: eventStartTime,
    event_name,
    description,
    host: eventHost,
    round_length,
  } = eventData
  const { name: eventHostName } = eventHost

  const alreadyAttending = event_users.find((u) => u.user.id === userId)

  //set event info to user local storage
  localStorage.setItem('event', JSON.stringify(eventData))

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

  const handleSignUpClick = () => {
    localStorage.setItem('eventId', eventId)
    history.push('/sign-up')
  }

  const renderSignupButton = () => (
    <Button size="large" color="primary" variant="contained" onClick={() => handleSignUpClick()}>
      RSVP for This Event{' '}
      <span role="img" aria-label="rocket">
        🚀
      </span>
    </Button>
  )

  const renderRsvpButton = () => (
    <Button
      variant="contained"
      disabled={rsvpInFlight}
      size="large"
      color="primary"
      onClick={async () => {
        setRSVPInFlight(true)
        if (alreadyAttending) {
          try {
            await deleteEventUserMutation()
            window.analytics.track('RSVP cancelled')
          } catch (error) {
            console.log('error = ', error)
          }
        } else {
          let calendarInviteResponse
          try {
            await insertEventUserMutation()

            window.analytics.track('RSVP made', {
              eventId,
              eventName: event_name,
            })

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
        element = !userId ? renderSignupButton() : <>{renderRsvpButton()}</>
    }
    return element
  }

  return (
    <>
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
              <Typography variant="h5">Participants Signed Up</Typography>
              <Typography variant="h2">{event_users.length}</Typography>
            </Grid>
          )}
          <Grid
            container
            item
            md={6}
            xs={12}
            className={classes.ctaButtonContainer}
            direction="column"
            justify="space-between"
            alignItems="center"
          >
            <Grid container item direction="column" justify="center" alignItems="center">
              {renderCTAButton()}
            </Grid>
            <Grid container item direction="column" justify="center" alignItems="center">
              {timeState === 'within 30 mins' ? (
                <EventCountdown adminHeader eventStartTime={eventStartTime} />
              ) : (
                <ShareEventPromptModal event={eventData} renderHostMessage />
              )}
            </Grid>
          </Grid>
        </Grid>
        {userId ? (
          <EventBreakdownStepper
            eventRoundLength={round_length}
            endMessage="You are all set! If you have already RSVPed, sit tight and wait for the event to
            start. If you have not RSVPed, scroll up and click the Sign Up / RSVP button!"
          />
        ) : null}
      </FloatCardLarge>
    </>
  )
}
export default UserPanel
