import React, { useEffect, useState } from 'react'

import { useMutation } from '@apollo/react-hooks'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import LinearProgress from '@material-ui/core/LinearProgress'
import Typography from '@material-ui/core/Typography'
import { useHistory } from 'react-router-dom'
import { makeStyles } from '@material-ui/styles'

import {
  EventBreakdownStepper,
  EventCountdown,
  SetupMicAndCameraButton,
  ShareEventPromptModal,
} from '.'
import { FloatCardLarge, CameraDisabledBanner } from '../../common'
import { useAppContext } from '../../context/useAppContext'
import { insertEventUser, deleteEventUser } from '../../gql/mutations'

const useStyles = makeStyles((theme) => ({
  cameraTest: {
    marginBottom: theme.spacing(4),
  },
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

const UserPanel = ({ timeState, eventData, permissions }) => {
  const classes = useStyles()
  const history = useHistory()
  const [rsvpInFlight, setRSVPInFlight] = useState(false)
  const { user, setCameraAndMicPermissions } = useAppContext()
  const { userId, name, email } = user
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

  const [waitingForAdmin, setWaitingForAdmin] = useState()

  const alreadyAttending = event_users.find((u) => u.user.id === userId)

  //set event info to user local storage
  localStorage.setItem('eventStartTime', eventStartTime)
  localStorage.setItem('event_name', event_name)
  localStorage.setItem('description', description)
  localStorage.setItem('eventHostName', eventHostName)

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
  }, [timeState, alreadyAttending])

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
        element = !userId ? (
          renderSignupButton()
        ) : (
          <>
            {renderRsvpButton()}
            <EventCountdown eventStartTime={eventStartTime} subtitle="Event Starts In:" />
          </>
        )
    }
    return element
  }

  const renderWaitingForHost = () =>
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
            <Typography variant="h5" className={classes.centerText}>
              The host will begin the event shortly
            </Typography>
          </Grid>
          <div className={classes.root}>
            <LinearProgress />
          </div>
        </Grid>
      </FloatCardLarge>
    )
  const micOrCameraIsDisabled = Object.values(permissions).indexOf(false) > -1

  if (micOrCameraIsDisabled && timeState !== 'future' && alreadyAttending) {
    return (
      <CameraDisabledBanner
        permissions={permissions}
        setCameraAndMicPermissions={setCameraAndMicPermissions}
      />
    )
  }

  return (
    <>
      {alreadyAttending && (
        <Grid container direction="row" justify="center" className={classes.cameraTest}>
          <SetupMicAndCameraButton
            permissions={permissions}
            setCameraAndMicPermissions={setCameraAndMicPermissions}
          />
        </Grid>
      )}
      {renderWaitingForHost()}

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
              <ShareEventPromptModal event={eventData} renderHostMessage={false} />
            </Grid>
          </Grid>
        </Grid>
        {userId ? <EventBreakdownStepper eventRoundLength={round_length} /> : null}
      </FloatCardLarge>
    </>
  )
}
export default UserPanel
