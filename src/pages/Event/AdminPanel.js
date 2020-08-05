import React from 'react'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import HelpOutlineIcon from '@material-ui/icons/HelpOutline'
import { makeStyles } from '@material-ui/styles'

import {
  AttendeesList,
  EventCountdown,
  StartPreEventButton,
  ListOfRSVPs,
  ShareEventPromptModal,
  SetupMicAndCameraButton,
} from '.'
import { EventForm, FloatCardLarge, TransitionModal, CameraDisabledBanner } from '../../common'
import { useAppContext } from '../../context/useAppContext'

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
  cameraTest: {
    marginBottom: theme.spacing(4),
  },
}))

const AdminPanel = ({ eventData, timeState, permissions }) => {
  const classes = useStyles()
  const { setCameraAndMicPermissions } = useAppContext()
  const micOrCameraIsDisabled = Object.values(permissions).indexOf(false) > -1

  const {
    event_users,
    id: eventId,
    start_at: eventStartTime,
    description: eventDescription,
    status,
  } = eventData

  const instructionModal = TransitionModal({
    modalBody: (
      <div>
        <Typography variant="h5" gutterBottom>
          Some Tips for hosting:
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          As a host, when you press 'start pre-event speech' you'll have a few minutes to address
          your audience.
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          It takes a few seconds for everyone to connect to this broadcast room, so we suggest that
          you wait about 5 - 10 seconds after seeing your own video (you wont see any of your
          participants' video). This way your speech isn't cut off in the beginning.
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          When you're ready to start the event after your speech just go ahead and press the 'start
          event button' that will be on the top left of your screen.
        </Typography>
        <Typography variant="h6">Enjoy the event ✨</Typography>
      </div>
    ),
    iconButton: {
      iconButtonIcon: <HelpOutlineIcon />,
      iconButtonColor: 'secondary',
    },
    onAcceptFunction: () => {},
    onAcceptButtonText: 'Ok, got it',
    hideNoWay: {},
  })

  const editFormModal = TransitionModal({
    modalBody: <EventForm eventData={eventData} />,
    button: {
      buttonColor: 'secondary',
      buttonVariant: 'outlined',
      buttonSize: 'medium',
      buttonText: 'Edit Event',
    },
  })

  const copyEventPromptModal = <ShareEventPromptModal event={eventData} renderHostMessage />
  const renderOnlineUsers = () => {
    return timeState === 'go time' || timeState === 'within 30 mins' ? (
      <Grid container item md={6} xs={12} direction="column">
        <AttendeesList eventId={eventId} timeState={timeState} />
      </Grid>
    ) : null
  }

  const renderButton = () => {
    let element

    switch (timeState) {
      case 'within 30 mins':
        element = (
          <Grid
            className={classes.adminButtons}
            container
            direction="column"
            alignItems="center"
            justify="space-between"
          >
            <Grid container direction="row" alignItems="center" justify="center">
              <StartPreEventButton
                disabled={micOrCameraIsDisabled}
                within30Mins
                eventStartTime={eventStartTime}
              />
              <div>{instructionModal}</div>
            </Grid>
            <EventCountdown
              adminHeader
              eventStartTime={eventStartTime}
              subtitle="Event Starts In:"
            />
            <div>{editFormModal}</div>
          </Grid>
        )
        break
      case 'go time':
        element = (
          <Grid
            className={classes.adminButtons}
            container
            direction="column"
            alignItems="center"
            justify="space-around"
          >
            <Grid container direction="row" alignItems="center" justify="center">
              <StartPreEventButton
                disabled={micOrCameraIsDisabled}
                eventId={eventId}
                status={status}
              />
              <div>{instructionModal}</div>
            </Grid>
            <div>{editFormModal}</div>
          </Grid>
        )
        break
      default:
        element = (
          <Grid
            className={classes.adminButtons}
            container
            direction="column"
            alignItems="center"
            justify="space-around"
          >
            <div>{copyEventPromptModal}</div>
            <div>{editFormModal}</div>
          </Grid>
        )
        break
    }

    return element
  }

  return (
    <>
      {micOrCameraIsDisabled ? (
        <CameraDisabledBanner
          permissions={permissions}
          setCameraAndMicPermissions={setCameraAndMicPermissions}
          admin
        />
      ) : (
        <Grid container direction="row" justify="center" className={classes.cameraTest}>
          <SetupMicAndCameraButton
            permissions={permissions}
            setCameraAndMicPermissions={setCameraAndMicPermissions}
          />
        </Grid>
      )}

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
            {renderButton()}
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
