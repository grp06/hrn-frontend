import React, { useEffect, useState } from 'react'

import { useMutation } from '@apollo/react-hooks'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import LinearProgress from '@material-ui/core/LinearProgress'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/styles'
import { useHistory } from 'react-router-dom'
import { FloatCardLarge, Timer, HiRightNowBreakdown, CameraDisabledBanner } from '.'

import { useAppContext } from '../context/useAppContext'
import { insertEventUser, deleteEventUser } from '../gql/mutations'
import SetupMicAndCameraButton from './SetupMicAndCameraButton'

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
  cameraTest: {
    marginBottom: theme.spacing(4),
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
      Sign Up{' '}
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
            <Typography variant="h5">The host will begin the event shortly</Typography>
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
            direction="column"
            justify="center"
            alignItems="center"
          >
            {renderCTAButton()}
          </Grid>
        </Grid>
        {userId ? <HiRightNowBreakdown eventRoundLength={round_length} /> : null}
      </FloatCardLarge>
    </>
  )
}
export default UserPanel
